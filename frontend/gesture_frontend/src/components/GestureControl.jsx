import React, { useEffect, useRef, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function GestureControl() {
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    checkStatus();
    return () => {
      disconnectWebSocket();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, []);

  /* ---------------- API ---------------- */

  async function checkStatus() {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      setRunning(Boolean(data.running));
      if (data.running) connectWebSocket();
    } catch {
      setRunning(false);
    }
  }

  async function startBackend() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/start`, { method: "POST" });
      const data = await res.json();

      if (data.status === "started" || data.status === "already_running") {
        setRunning(true);
        pushEvent("system", "Backend started");
        connectWebSocket(true);
      } else {
        pushEvent("error", JSON.stringify(data));
      }
    } catch (e) {
      pushEvent("error", String(e));
    } finally {
      setLoading(false);
    }
  }

  async function stopBackend() {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/stop`, { method: "POST" });
      setRunning(false);
      pushEvent("system", "Backend stopped");
      disconnectWebSocket();
    } catch (e) {
      pushEvent("error", String(e));
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- WebSocket ---------------- */

  function connectWebSocket(force = false) {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !force)
      return;

    disconnectWebSocket();

    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    wsRef.current = ws;

    ws.onopen = () => pushEvent("system", "WebSocket connected");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        pushEvent("gesture", data);
      } catch {
        pushEvent("event", e.data);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      pushEvent("system", "WebSocket disconnected");
      if (running) {
        reconnectTimer.current = setTimeout(connectWebSocket, 1500);
      }
    };
  }

  function disconnectWebSocket() {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }

  /* ---------------- Events ---------------- */

  function pushEvent(type, payload) {
    setEvents((prev) => [
      { ts: Date.now(), type, payload },
      ...prev.slice(0, 11),
    ]);
  }

  function time(ts) {
    return new Date(ts).toLocaleTimeString();
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="glass-card p-5">
      <h3 className="text-lg font-semibold mb-2">Gesture Backend</h3>

      <div className="flex gap-3 mb-4">
        <button
          className="btn"
          onClick={startBackend}
          disabled={loading || running}
        >
          {loading ? "Starting..." : "Start Backend"}
        </button>

        <button
          className="btn-ghost"
          onClick={stopBackend}
          disabled={loading || !running}
        >
          Stop Backend
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              running ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>{running ? "Running" : "Stopped"}</span>
        </div>
      </div>

      <div className="max-h-64 overflow-auto space-y-2">
        {events.length === 0 && (
          <div className="text-sm text-muted-foreground">No events yet</div>
        )}

        {events.map((e, i) => (
          <div key={i} className="p-2 border rounded text-sm">
            <div className="text-xs text-muted-foreground">
              {time(e.ts)} — {e.type}
            </div>

            {e.type === "gesture" ? (
              <div className="font-medium">
                Gesture: {e.payload.name}
              </div>
            ) : (
              <div>{String(e.payload)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

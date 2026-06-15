// src/hooks/useGestureSocket.ts
import { useEffect, useRef, useState } from "react";

export type GestureEvent = {
  type?: string;
  name?: string;
  [k: string]: any;
};

export function useGestureSocket(url = "ws://127.0.0.1:8000/ws") {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<GestureEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          setLastEvent(data);
        } catch (e) {
          console.warn("WS parse error", e);
        }
      };
      ws.onclose = () => setConnected(false);
      ws.onerror = () => setConnected(false);

      return () => {
        try {
          ws.close();
        } catch {}
      };
    } catch (err) {
      console.error("Could not open WebSocket", err);
    }
  }, [url]);

  return { connected, lastEvent };
}

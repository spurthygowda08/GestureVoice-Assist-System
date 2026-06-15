import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8000/ws";

export default function CurrentGesture() {
  const [gesture, setGesture] = useState("None");

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "gesture") {
          setGesture(data.name);
        }
      } catch (e) {
        console.error("Invalid WS data", e);
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket disconnected");
    };

    return () => ws.close();
  }, []);

  return (
    <div className="glass-card p-5 transition-smooth">
      <p className="text-sm text-muted-foreground mb-1">
        Current Gesture
      </p>

      <p className="text-2xl font-bold text-primary capitalize">
        {gesture.replace("_", " ")}
      </p>
    </div>
  );
}

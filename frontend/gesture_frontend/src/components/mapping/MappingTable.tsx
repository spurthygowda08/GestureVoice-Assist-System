import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

/**
 * These gesture names MUST match what backend emits
 * (gesture_controller_module.py → _emit_gesture("name"))
 */
const GESTURES = [
  "move",
  "left_click",
  "right_click",
  "double_click",
  "screenshot",
  "swipe_left",
  "swipe_right",
  "palm",
  "fist"
];

/**
 * These actions MUST match handle_mapped_action() in server.py
 */
const ACTIONS = [
  "next_slide",
  "previous_slide",
  "scroll_up",
  "scroll_down",
  "volume_up",
  "volume_down",
  "pause",
  "minimize"
];

export function MappingTable() {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMappings();
  }, []);

  async function fetchMappings() {
    try {
      const res = await fetch(`${API_BASE}/gesture-mappings`);
      const data = await res.json();
      setMappings(data || {});
    } catch (err) {
      console.error("Failed to load mappings", err);
    }
  }

  async function updateMapping(gesture: string, action: string) {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/gesture-mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gesture, action })
      });
      fetchMappings();
    } catch (err) {
      console.error("Failed to save mapping", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">
        Gesture → Action Mapping
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border/30">
            <th className="py-2">Gesture</th>
            <th>Mapped Action</th>
          </tr>
        </thead>

        <tbody>
          {GESTURES.map((gesture) => (
            <tr key={gesture} className="border-b border-border/20">
              <td className="py-3 font-medium">{gesture}</td>

              <td>
                <select
                  className="bg-muted/40 border border-border rounded px-2 py-1"
                  value={mappings[gesture] || ""}
                  disabled={loading}
                  onChange={(e) =>
                    updateMapping(gesture, e.target.value)
                  }
                >
                  <option value="">— Select Action —</option>
                  {ACTIONS.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-muted-foreground">
        Tip: Gesture names must exactly match backend detection logic.
      </p>
    </div>
  );
}

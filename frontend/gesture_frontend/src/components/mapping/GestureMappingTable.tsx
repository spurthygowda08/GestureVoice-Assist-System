import { useEffect, useState } from "react";
import { getMappings, saveMapping } from "@/services/mappingService";

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

export default function GestureMappingTable() {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMappings();
  }, []);

  async function loadMappings() {
    const data = await getMappings();
    setMappings(data);
  }

  async function handleChange(gesture: string, action: string) {
    await saveMapping(gesture, action);
    loadMappings();
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold mb-4">Gesture Mappings</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th>Gesture</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mappings).map(([gesture, action]) => (
            <tr key={gesture} className="border-b border-border/20">
              <td className="py-2">{gesture}</td>
              <td>
                <select
                  value={action}
                  onChange={(e) => handleChange(gesture, e.target.value)}
                  className="bg-muted p-1 rounded"
                >
                  {ACTIONS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const API_BASE = "http://localhost:8000";

export async function getMappings() {
  const res = await fetch(`${API_BASE}/gesture-mappings`);
  return res.json();
}

export async function saveMapping(gesture: string, action: string) {
  const res = await fetch(`${API_BASE}/gesture-mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gesture, action })
  });
  return res.json();
}

export async function deleteMapping(gesture: string) {
  const res = await fetch(`${API_BASE}/gesture-mappings/${gesture}`, {
    method: "DELETE"
  });
  return res.json();
}

// src/api.js
export const API_BASE = "http://127.0.0.1:8000";

export async function startBackend() {
  const res = await fetch(`${API_BASE}/start`, { method: "POST" });
  return res.json();
}

export async function stopBackend() {
  const res = await fetch(`${API_BASE}/stop`, { method: "POST" });
  return res.json();
}

export async function getStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Status request failed");
  return res.json(); // { running: boolean }
}

export async function sendVoiceCommand(text: string) {
  const res = await fetch(`${API_BASE}/voice-command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

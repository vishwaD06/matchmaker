/**
 * API Client for interacting with the FastAPI backend
 */

const API_BASE = "http://localhost:8000/api";

export async function* streamChat(messages, phase) {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, phase }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Read SSE stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Parse SSE events
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || ""; // Keep the incomplete line in the buffer

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            yield parsed;
          } catch (e) {
            console.error("Failed to parse SSE data:", data);
          }
        }
      }
    }
  } catch (error) {
    console.error("Chat API error:", error);
    yield { type: "error", content: error.message };
  }
}

export async function generateProfile(messages) {
  const response = await fetch(`${API_BASE}/chat/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    throw new Error(`Profile API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.profile;
}

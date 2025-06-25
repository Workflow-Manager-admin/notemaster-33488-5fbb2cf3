//
// API client for interacting with the FastAPI notes backend
//

// PUBLIC_INTERFACE
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = await response.text();
    throw new Error(errorMsg || "API error");
  }
  return response.json();
}

// PUBLIC_INTERFACE
export async function fetchNotes(query = "") {
  // GET /notes?search=query
  let url = `${API_BASE_URL}/notes`;
  if (query) url += `?search=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function getNote(id) {
  // GET /notes/{id}
  const res = await fetch(`${API_BASE_URL}/notes/${id}`);
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  // POST /notes
  const res = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateNote(id, note) {
  // PUT /notes/{id}
  const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  // DELETE /notes/{id}
  const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Delete failed");
}

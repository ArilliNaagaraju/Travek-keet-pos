const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  return res.json();
}

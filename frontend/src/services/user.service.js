import { apiFetch } from "./api";

export function fetchUsers() {
  return apiFetch("/users", { headers: { Authorization: "demo-token" } });
}

const BASE = "https://localhost:7086/api"; // përdor URL e backend-it tënd

export async function getTasks() {
  const res = await fetch(`${BASE}/TaskItem`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${BASE}/TaskItem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE}/TaskItem/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/TaskItem/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}

export async function getCategories() {
  const res = await fetch(`${BASE}/Category`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function getPriorities() {
  const res = await fetch(`${BASE}/Priority`);
  if (!res.ok) throw new Error("Failed to fetch priorities");
  return res.json();
}

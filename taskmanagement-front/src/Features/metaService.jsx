const BASE = "https://localhost:7086/api";

export async function getTasksByUser(userId) {
  const res = await fetch(`${BASE}/TaskItem/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks for user");
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

export async function getTags() {
  const res = await fetch(`${BASE}/Tags`);
  if (!res.ok) {
    console.error("Tag API returned", res.status, await res.text());
    return [];
  }
  return res.json();
}


export async function getTagById(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch tag");
  return res.json();
}


export async function createTag(data) {
  const response = await fetch("https://localhost:7086/api/Tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create tag");
  return await response.json();
}


export async function updateTag(id, tag) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to update tag");
  return res.json();
}

export async function deleteTag(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to delete tag");
  return res.json();
}

export async function getTaskTags(taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/tags`);
  if (!res.ok) throw new Error("Failed loading task tags");
  return res.json();
}


export async function addTaskTag(taskId, tagId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
  if (!res.ok) throw new Error("Failed adding tag to task");
  return res.json();
}

export async function removeTaskTag(taskId, tagId) {
  const res = await fetch(`${BASE}/tasks/${taskId}/tags/${tagId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed removing tag from task");
}


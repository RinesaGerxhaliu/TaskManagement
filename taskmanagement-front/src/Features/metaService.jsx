const BASE = "https://localhost:7086/api";

export async function getTasksByUser(userId) {
  const res = await fetch(`${BASE}/TaskItem/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks for user");
  return res.json();
}

 export async function createTask(task) {
  const token = localStorage.getItem("token");
   const res = await fetch(`${BASE}/TaskItem`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
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
  const res = await fetch(`${BASE}/Tags/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    const error = new Error(text || "Failed to fetch tag");
    error.status = res.status;
    throw error;
  }
  return res.json();
}


export async function createTag(data) {
  const res = await fetch(`${BASE}/Tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const text = await res.text();
  if (!res.ok) {
    const error = new Error(text || "Failed to create tag");
    error.status = res.status;
    throw error;
  }
  return JSON.parse(text);
}


export async function updateTag(id, tag) {
  const res = await fetch(`${BASE}/Tags/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (res.status === 404) return null;

  const text = await res.text();
  if (!res.ok) {
    const error = new Error(text || "Failed to update tag");
    error.status = res.status;
    throw error;
  }
  return JSON.parse(text);
}

export async function deleteTag(id) {
  const res = await fetch(`${BASE}/Tags/${id}`, {
    method: "DELETE",
  });
  if (res.status === 404) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    const error = new Error(text || "Failed to delete tag");
    error.status = res.status;
    throw error;
  }
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

/** Get category by ID */
export async function getCategoryById(id) {
  const res = await fetch(`${BASE}/Category/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
}

/** Create a new category */
export async function createCategory(data) {
  const res = await fetch(`${BASE}/Category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

/** Update an existing category */
export async function updateCategory(id, data) {
  const res = await fetch(`${BASE}/Category/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

/** Delete a category */
export async function deleteCategory(id) {
  const res = await fetch(`${BASE}/Category/${id}`, {
    method: "DELETE",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
}


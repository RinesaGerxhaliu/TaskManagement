const BASE = "/api/tasks";

export async function getTaskTags(taskId) {
  const res = await fetch(`${BASE}/${taskId}/tags`);    
  if (!res.ok) throw new Error("Failed loading task tags");
  return res.json();
}

export async function addTaskTag(taskId, tagId) {
  const res = await fetch(`${BASE}/${taskId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tagId }),
  });
  if (!res.ok) throw new Error("Failed adding tag to task");
  return res.json();
}

export async function removeTaskTag(taskId, tagId) {
  const res = await fetch(`${BASE}/${taskId}/tags/${tagId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed removing tag from task");
}

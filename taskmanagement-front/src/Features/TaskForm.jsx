import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TaskForm = ({ initial = {}, onSubmit }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [categoryId, setCategoryId] = useState(initial.categoryId || "");
  const [priorityId, setPriorityId] = useState(initial.priorityId || "");

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7086/api/Category")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);

    fetch("https://localhost:7086/api/Priority")
      .then(res => res.json())
      .then(data => setPriorities(data))
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryId || !priorityId) {
      alert("Please select Category and Priority");
      return;
    }

    onSubmit({
      title,
      description,
      categoryId: Number(categoryId),
      priorityId: Number(priorityId),
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
        <h2 className="mb-4 text-center">
          {initial.id ? "Edit Task" : "Add Task"}
        </h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">Title</label>
          <input
            className="form-control"
            placeholder="Enter task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Category</label>
          <select
            className="form-select"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Priority</label>
          <select
            className="form-select"
            value={priorityId}
            onChange={e => setPriorityId(e.target.value)}
            required
          >
            <option value="">-- Select Priority --</option>
            {priorities.map(pri => (
              <option key={pri.id} value={pri.id}>{pri.name}</option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button type="submit" className="btn btn-primary px-4">
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

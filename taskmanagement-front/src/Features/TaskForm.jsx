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
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);

    fetch("https://localhost:7086/api/Priority")
      .then((res) => res.json())
      .then((data) => setPriorities(data))
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
    <div
      style={{
        minHeight: "100vh",
       
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(245, 248, 255, 0.95)",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#1F3A93",
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: "#1F3A93" }}>
          {initial.id ? "Edit Task" : "Add Task"}
        </h2>

        <div className="mb-3">
          <label
            className="form-label fw-semibold"
            style={{ color: "#1F3A93" }}
          >
            Title
          </label>
          <input
            className="form-control"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>

        <div className="mb-3">
          <label
            className="form-label fw-semibold"
            style={{ color: "#1F3A93" }}
          >
            Description
          </label>
          <textarea
            className="form-control"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
          />
        </div>

        <div className="mb-3">
          <label
            className="form-label fw-semibold"
            style={{ color: "#1F3A93" }}
          >
            Category
          </label>
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label
            className="form-label fw-semibold"
            style={{ color: "#1F3A93" }}
          >
            Priority
          </label>
          <select
            className="form-select"
            value={priorityId}
            onChange={(e) => setPriorityId(e.target.value)}
            required
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="">-- Select Priority --</option>
            {priorities.map((pri) => (
              <option key={pri.id} value={pri.id}>
                {pri.name}
              </option>
            ))}
          </select>
        </div>

        <div
          className="d-flex justify-content-center gap-3 mt-4"
          style={{ gap: "20px" }}
        >
          <button
            type="submit"
            className="btn btn-primary px-4"
            style={{
              backgroundColor: "#357ABD",
              borderColor: "#2E67B1",
              fontWeight: "600",
              boxShadow: "0 3px 8px rgba(53, 122, 189, 0.6)",
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={handleCancel}
            style={{
              fontWeight: "600",
              color: "#357ABD",
              borderColor: "#357ABD",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

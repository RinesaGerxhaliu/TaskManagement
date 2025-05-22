import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TaskForm = ({ initial = {} }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [categoryId, setCategoryId] = useState(initial.categoryId || "");
  const [status, setStatus] = useState(initial.status || "ToDo");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);


  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7086/api/Category")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!categoryId) {
    setError("Please select a category");
    return;
  }

  const taskData = {
    title,
    description,
    categoryId: Number(categoryId),
    status,
  };

  try {
    setLoading(true);

    const token = localStorage.getItem("token"); // ✅ Get token here

    const response = await fetch("https://localhost:7086/api/TaskItem", {
      method: initial.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Pass token here
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      setError("Failed to save task!");
      setLoading(false);
      return;
    }

    const msg = initial.id
      ? "Task updated successfully!"
      : "Task added successfully!";

    setSuccess(msg);
    navigate("/", { state: { message: msg } });
  } catch (err) {
    setError("Error: " + err.message);
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "#f7f9fc",
      }}
    >
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "white",
          padding: "40px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#1F3A93",
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: "#1F3A93" }}>
          {initial.id ? "Edit Task" : "Add Task"}
        </h2>

        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Title
          </label>
          <input
            id="title"
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
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Description
          </label>
          <textarea
            id="description"
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
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Category
          </label>
          <select
            id="category"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
            disabled={loading}
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
          <label htmlFor="status" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Status
          </label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease",
            }}
            disabled={loading}
          >
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4" style={{ gap: "20px" }}>
          <button
            type="submit"
            className="btn btn-primary px-4"
            style={{
              backgroundColor: "#357ABD",
              borderColor: "#2E67B1",
              fontWeight: "600",
              boxShadow: "0 3px 8px rgba(53, 122, 189, 0.6)",
            }}
            disabled={loading}
          >
            {loading ? (initial.id ? "Saving..." : "Adding...") : "Save"}
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
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

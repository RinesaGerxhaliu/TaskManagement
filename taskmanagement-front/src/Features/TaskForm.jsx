import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MAX_TITLE_LENGTH = 100;
const MIN_TITLE_LENGTH = 1;
const MAX_DESCRIPTION_LENGTH = 500;
const VALID_STATUSES = ["ToDo", "InProgress", "Done"];

const TaskForm = ({ initial = {} }) => {
  const [title, setTitle] = useState(initial.title || "");
  const [description, setDescription] = useState(initial.description || "");
  const [categoryId, setCategoryId] = useState(initial.categoryId || "");
  const [status, setStatus] = useState(initial.status || "ToDo");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      setTestResults((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          description: "Task submission",
          status: "Pass",
          message: success,
        },
      ]);
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setTestResults((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          description: "Task submission",
          status: "Fail",
          message: error,
        },
      ]);
    }
  }, [error]);

  useEffect(() => {
    fetch("https://localhost:7086/api/Category")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (title.trim().length < MIN_TITLE_LENGTH)
      return `Title must be at least ${MIN_TITLE_LENGTH} character(s).`;
    if (title.trim().length > MAX_TITLE_LENGTH)
      return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;

    if (description.trim().length > MAX_DESCRIPTION_LENGTH)
      return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`;

    if (!VALID_STATUSES.includes(status))
      return `Status must be one of: ${VALID_STATUSES.join(", ")}.`;

    if (!categoryId || isNaN(Number(categoryId)) || Number(categoryId) <= 0)
      return "Please select a valid category.";

    return null; // no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      status: status.trim(),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("https://localhost:7086/api/TaskItem", {
        method: initial.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.message ||
          (response.status === 400
            ? "Validation failed."
            : "Failed to save task!");
        setError(message);
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

  // Kontrolli i validitetit për çaktivizim butoni
  const isFormValid = !validate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "#f7f9fc",
        flexDirection: "column",
      }}
    >
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
          marginBottom: "30px",
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: "#1F3A93" }}>
          {initial.id ? "Edit Task" : "Add Task"}
        </h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success text-center" role="alert">
            {success}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-semibold">
            Title
          </label>
          <input
            id="title"
            data-testid="task-title"
            className="form-control"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={MAX_TITLE_LENGTH}
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold">
            Description
          </label>
          <textarea
            id="description"
            data-testid="task-description"
            className="form-control"
            placeholder="Enter task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={MAX_DESCRIPTION_LENGTH}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label fw-semibold">
            Category
          </label>
          <select
            id="category"
            data-testid="task-category"
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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
          <label htmlFor="status" className="form-label fw-semibold">
            Status
          </label>
          <select
            id="status"
            data-testid="task-status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            type="submit"
            data-testid="submit-task"
            className="btn btn-primary px-4"
            disabled={loading || !isFormValid}
          >
            {loading ? (initial.id ? "Saving..." : "Adding...") : "Save"}
          </button>
          <button
            type="button"
            data-testid="cancel-task"
            className="btn btn-outline-secondary px-4"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Test Results */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#1F3A93",
        }}
      >
        <h4>Test Results:</h4>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.description}</td>
                <td
                  style={{
                    color: test.status === "Pass" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {test.status}
                </td>
                <td>{test.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskForm;

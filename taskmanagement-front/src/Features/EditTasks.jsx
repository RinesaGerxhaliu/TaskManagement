import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const validStatuses = ["ToDo", "InProgress", "Done"];

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "ToDo",
    categoryId: ""
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, catRes] = await Promise.all([
          axios.get(`https://localhost:7086/api/TaskItem/${id}`),
          axios.get("https://localhost:7086/api/Category")
        ]);

        const taskData = taskRes.data;

        setTask({
          title: taskData.title || "",
          description: taskData.description || "",
          status: taskData.status || "ToDo",
          categoryId: taskData.categoryId?.toString() || ""
        });

        setCategories(catRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrors({ general: "Error fetching data. Please try again." });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!task.title || task.title.trim() === "") {
      validationErrors.title = "Title is required.";
    }

    if (task.title && task.title.length > 100) {
      validationErrors.title = "Title must be maximum 100 characters.";
    }

    if (!validStatuses.includes(task.status)) {
      validationErrors.status = "Status must be ToDo, InProgress, or Done.";
    }

    if (!task.categoryId) {
      validationErrors.categoryId = "Please select a category.";
    }
    if (task.description && task.description.length > 500) {
      validationErrors.description = "Description must be maximum 500 characters.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!validate()) {
      return;
    }

    try {
      await axios.put(`https://localhost:7086/api/TaskItem/${id}`, {
        title: task.title.trim(),
        description: task.description,
        status: task.status,
        categoryId: Number(task.categoryId)
      });

      const msg = "Task updated successfully!";
      setSuccess(msg);
      navigate("/", { state: { message: msg } });
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data) {
        const modelErrors = {};
        const data = err.response.data;
        if (typeof data === "object") {
          for (const key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              modelErrors[key.toLowerCase()] = data[key].join(" ");
            }
          }
        }
        setErrors(modelErrors);
      } else if (err.response && err.response.status === 409) {
        setErrors({ general: "Failed to update task: Task already exists." });
      } else {
        setErrors({ general: "An error occurred while updating the task." });
      }
      console.error("Error during save:", err);
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px"
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
          color: "#1F3A93"
        }}
        noValidate
      >
        <h2 className="mb-4 text-center" style={{ color: "#1F3A93" }}>
          Edit Task
        </h2>

        {success && (
          <div className="alert alert-success text-center">{success}</div>
        )}
        {errors.general && (
          <div className="alert alert-danger text-center">{errors.general}</div>
        )}

        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-semibold">
            Title <span style={{ color: "red" }}>*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            placeholder="Enter task description (optional)"
            value={task.description}
            onChange={handleChange}
            rows={4}
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label fw-semibold">
            Status <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="status"
            name="status"
            className={`form-select ${errors.status ? "is-invalid" : ""}`}
            value={task.status}
            onChange={handleChange}
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
            required
          >
            <option value="ToDo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {errors.status && (
            <div className="invalid-feedback">{errors.status}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="categoryId" className="form-label fw-semibold">
            Category <span style={{ color: "red" }}>*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
            value={task.categoryId}
            onChange={handleChange}
            required
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="invalid-feedback">{errors.categoryId}</div>
          )}
        </div>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4"
            style={{
              backgroundColor: "#357ABD",
              borderColor: "#2E67B1",
              fontWeight: "600",
              boxShadow: "0 3px 8px rgba(53, 122, 189, 0.6)"
            }}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate("/")}
            style={{
              fontWeight: "600",
              color: "#357ABD",
              borderColor: "#357ABD"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;

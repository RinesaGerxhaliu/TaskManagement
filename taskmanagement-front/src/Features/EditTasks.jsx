import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [error, setError] = useState("");
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
        const taskRes = await axios.get(`https://localhost:7086/api/TaskItem/${id}`);
        const taskData = taskRes.data;

        setTask({
          title: taskData.title || "",
          description: taskData.description || "",
          status: taskData.status || "ToDo",
          categoryId: taskData.categoryId?.toString() || ""
        });

        const catRes = await axios.get("https://localhost:7086/api/Category");
        setCategories(catRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Gabim:", err);
        setError("Gabim gjatë marrjes së të dhënave. Provoni përsëri.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.categoryId) {
      alert("Ju lutem zgjidhni Kategorinë");
      return;
    }

    try {
      await axios.put(`https://localhost:7086/api/TaskItem/${id}`, {
        title: task.title,
        description: task.description,
        status: task.status,
        categoryId: Number(task.categoryId)
      });
      const msg = "Task updated successfully!";
      setSuccess(msg);
      navigate("/", { state: { message: msg } });
    } catch (err) {
      console.error("Gabim gjatë ruajtjes:", err);
      setError("Error during task update.");
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
          color: "#1F3A93"
        }}
      >
        <h2 className="mb-4 text-center" style={{ color: "#1F3A93" }}>
          Edit Task
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="title" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-control"
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
            autoFocus
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
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
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={task.status}
            onChange={handleChange}
            style={{
              borderColor: "#357ABD",
              boxShadow: "0 0 5px #4A90E2",
              transition: "border-color 0.3s ease"
            }}
          >
            <option value="ToDo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="categoryId" className="form-label fw-semibold" style={{ color: "#1F3A93" }}>
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="form-select"
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

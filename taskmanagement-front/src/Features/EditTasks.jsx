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
    categoryId: "",
    priorityId: ""
  });

  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await axios.get(`https://localhost:7086/api/TaskItem/${id}`);
        const taskData = taskRes.data;

        setTask({
          title: taskData.title || "",
          description: taskData.description || "",
          status: taskData.status || "ToDo",
          categoryId: taskData.categoryId?.toString() || "",
          priorityId: taskData.priorityId?.toString() || ""
        });

        const [catRes, priRes] = await Promise.all([
          axios.get("https://localhost:7086/api/Category"),
          axios.get("https://localhost:7086/api/Priority")
        ]);

        setCategories(catRes.data);
        setPriorities(priRes.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Gabim:", err);
        setError("Gabim gjatë marrjes së të dhënave. Provoni përsëri.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = e => {
    setTask(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`https://localhost:7086/api/TaskItem/${id}`, {
        ...task,
        categoryId: Number(task.categoryId),
        priorityId: Number(task.priorityId)
      });
      alert("Detyra u përditësua me sukses.");
      navigate("/");
    } catch (err) {
      console.error("Gabim gjatë ruajtjes:", err);
      alert("Gabim gjatë ruajtjes së të dhënave.");
    }
  };

  if (isLoading) return <div className="d-flex justify-content-center align-items-center" style={{height: "60vh"}}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>;

  return (
    <div className="container my-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm p-4">
        <h2 className="mb-4 text-center text-primary fw-bold">Edit Task</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">
              Titulli
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Shkruaj titullin"
              value={task.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              Përshkrimi
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              placeholder="Shkruaj përshkrimin (opsionale)"
              value={task.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="status" className="form-label fw-semibold">
              Statusi
            </label>
            <select
              id="status"
              name="status"
              className="form-select"
              value={task.status}
              onChange={handleChange}
            >
              <option value="ToDo">ToDo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label fw-semibold">
              Kategoria
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="form-select"
              value={task.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Zgjedh Kategorinë --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="priorityId" className="form-label fw-semibold">
              Prioriteti
            </label>
            <select
              id="priorityId"
              name="priorityId"
              className="form-select"
              value={task.priorityId}
              onChange={handleChange}
              required
            >
              <option value="">-- Zgjedh Prioritetin --</option>
              {priorities.map(p => (
                <option key={p.id} value={p.id.toString()}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold shadow-sm">
              Ruaj Ndryshimet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;

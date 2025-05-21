import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, getCategories } from "../Features/metaService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const filteredTasks = tasks.filter(task => {
    return (
      (filterCategory === "" || task.categoryId === Number(filterCategory)) &&
      (filterStatus === "" || task.status === filterStatus)
    );
  });

  const handleAddTaskClick = () => {
    navigate("/add");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "40px 80px", // wider horizontal padding
      }}
    >
      <div
        style={{
          maxWidth: "1200px", // wider container
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          padding: "30px 40px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary fw-bold border-bottom pb-2 mb-0">
            Task List
          </h2>
          <button
            onClick={handleAddTaskClick}
            className="btn btn-success shadow-sm"
            title="Add new task"
          >
            <i className="bi bi-plus-lg me-2"></i> Add Task
          </button>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <label htmlFor="categoryFilter" className="form-label fw-semibold">
              Filter by Category
            </label>
            <select
              id="categoryFilter"
              className="form-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="statusFilter" className="form-label fw-semibold">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              className="form-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">-- Select Status --</option>
              <option value="ToDo">ToDo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0" style={{ minWidth: "100%" }}>
            <thead className="table-primary text-center">
              <tr>
                <th style={{ minWidth: "220px" }}>Title</th>
                <th style={{ minWidth: "150px" }}>Category</th>
                <th style={{ minWidth: "130px" }}>Status</th>
                <th style={{ minWidth: "130px" }}>Priority</th>
                <th style={{ minWidth: "150px" }}>Created At</th>
                <th style={{ minWidth: "100px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted fst-italic">
                    No tasks to display. <br />
                    <button
                      className="btn btn-outline-primary mt-3"
                      onClick={handleAddTaskClick}
                    >
                      Add a New Task
                    </button>
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="text-center">
                    <td className="fw-semibold text-start">{task.title}</td>
                    <td>{task.categoryName}</td>
                    <td>
                      <span
                        className={`badge ${
                          task.status === "Done"
                            ? "bg-success"
                            : task.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{task.priorityName}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/edit/${task.id}`)}
                        title="Edit Task"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;

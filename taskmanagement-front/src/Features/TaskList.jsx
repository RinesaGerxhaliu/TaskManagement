import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasksByUser, getCategories } from "../Features/metaService";
import TaskTagManager from "../Components/Layout/TaskTagManager";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function TaskList() {
  const [tasks, setTasks]                 = useState([]);
  const [categories, setCategories]       = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus]     = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tagRefreshKey, setTagRefreshKey]   = useState(0);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState("");
  const [showConfirm, setShowConfirm]       = useState(false);
  const [confirmTaskId, setConfirmTaskId]   = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Funksion për të marrë UserId nga tokeni (nga nameidentifier)
  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      // Ky key është nga JWT payload-i që dërgove më lart!
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch {
      return null;
    }
  }

  // Auto-clear success message
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(timer);
  }, [success]);

  // Initial load: Merr tasks vetem per userin e loguar!
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return; // Nese nuk ekziston userId, mos e thirr API-n
    getTasksByUser(userId)
      .then(setTasks)
      .catch(e => setError(e.message));
    getCategories().then(setCategories).catch(e => setError(e.message));
  }, []);

  // Read navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const filteredTasks = tasks.filter(task =>
    (filterCategory === "" || task.categoryId === Number(filterCategory)) &&
    (filterStatus === "" || task.status === filterStatus)
  );

  const confirmDelete = id => {
    setConfirmTaskId(id);
    setShowConfirm(true);
  };

  const handleDeleteTask = async () => {
    if (confirmTaskId == null) return;
    try {
      const res = await fetch(
        `https://localhost:7086/api/TaskItem/${confirmTaskId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");
      setTasks(prev => prev.filter(t => t.id !== confirmTaskId));
      setSuccess("Task deleted successfully!");
    } catch (e) {
      setError(e.message);
    } finally {
      setShowConfirm(false);
      setConfirmTaskId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setConfirmTaskId(null);
  };

  return (
    <div className="container my-4">
      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Task List</h2>
        <button
          className="btn btn-success"
          onClick={() => navigate("/add")}
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-3 g-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">-- Filter by Category --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">-- Filter by Status --</option>
            <option value="ToDo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Tag selector */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <label className="form-label">Select Task to Tag</label>
          <select
            className="form-select"
            value={selectedTaskId || ""}
            onChange={e => setSelectedTaskId(Number(e.target.value))}
          >
            <option value="" disabled>Select a task…</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="col-md-6 d-flex align-items-end">
          {selectedTaskId && (
            <TaskTagManager
              taskId={selectedTaskId}
              showBadges={false}
              showDropdown={true}
              onTagAdded={() => setTagRefreshKey(k => k + 1)}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead className="table-primary text-center align-middle">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Tags</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted">No tasks found.</td>
              </tr>
            ) : (
              filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.categoryName}</td>
                  <td>
                    <span className={`badge ${
                      task.status === "Done"         ? "bg-success" :
                      task.status === "In Progress" ? "bg-warning text-dark" :
                                                     "bg-secondary"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td>{task.description}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td>
                    <TaskTagManager
                      taskId={task.id}
                      showBadges
                      showDropdown={false}
                      refreshKey={tagRefreshKey}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/edit/${task.id}`)}
                    >✏️</button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => confirmDelete(task.id)}
                    >🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 8, textAlign: "center" }}>
            <p>Are you sure you want to delete this task?</p>
            <button className="btn btn-danger me-2" onClick={handleDeleteTask}>Yes, delete</button>
            <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

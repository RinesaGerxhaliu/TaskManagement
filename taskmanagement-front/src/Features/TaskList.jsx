// src/Features/TaskList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, getCategories } from "../Features/metaService";
import TaskTagManager from "../Components/Layout/TaskTagManager";

const TaskList = () => {
  const [tasks, setTasks]                 = useState([]);
  const [categories, setCategories]       = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus]   = useState("");
  const [showConfirm, setShowConfirm]     = useState(false);
  const [confirmTaskId, setConfirmTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tagRefreshKey, setTagRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // filter the tasks
  const filteredTasks = tasks.filter(task =>
    (filterCategory === "" || task.categoryId === Number(filterCategory)) &&
    (filterStatus   === "" || task.status === filterStatus)
  );

  // confirm delete popup
  const confirmDelete = taskId => {
    setConfirmTaskId(taskId);
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
      setTasks(ts => ts.filter(t => t.id !== confirmTaskId));
    } catch (err) {
      alert(err.message);
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", padding: 40 }}>
      <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          background: "#fff",
          padding: 30,
          borderRadius: 12
        }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Task List</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate("/add")}
          >
            + Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <label className="form-label">Filter by Category</label>
            <select
              className="form-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Filter by Status</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ToDo">ToDo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Tag assignment dropdown (outside table) */}
        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <label className="form-label">Select Task to Tag</label>
            <select
              className="form-select"
              value={selectedTaskId || ""}
              onChange={e => setSelectedTaskId(Number(e.target.value))}
            >
              <option value="" disabled>Select a task…</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
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

        {/* Task table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created At</th>
                <th>Tags</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => (
                  <tr key={task.id} className="text-center">
                    <td className="text-start">{task.title}</td>
                    <td>{task.categoryName}</td>
                    <td>
                      <span className={`badge ${
                        task.status === "Done" ? "bg-success" :
                        task.status === "In Progress" ? "bg-warning text-dark" :
                        "bg-secondary"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.priorityName}</td>
                    <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                    <td style={{ width: 200, whiteSpace: "nowrap" }}>
                      <TaskTagManager
                        taskId={task.id}
                        showBadges={true}
                        showDropdown={false}
                        refreshKey={tagRefreshKey}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/edit/${task.id}`)}
                      >
                        ✏️
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(task.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#fff", padding: 20, borderRadius: 8,
            textAlign: "center", minWidth: 300
          }}>
            <p>Really delete this task?</p>
            <button
              className="btn btn-danger me-2"
              onClick={handleDeleteTask}
            >
              Yes, delete
            </button>
            <button
              className="btn btn-secondary"
              onClick={cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

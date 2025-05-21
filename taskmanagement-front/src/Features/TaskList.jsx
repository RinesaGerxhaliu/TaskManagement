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
    navigate("/add");  // Ndrysho këtë URL sipas rutës tënde për formën Add Task
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista e Detyrave</h2>
        <button
          onClick={handleAddTaskClick}
          className="btn btn-sm btn-success"
          title="Shto detyrë të re"
        >
          + Add Task
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">-- Filtrimi sipas Kategorisë --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">-- Filtrimi sipas Statusit --</option>
            <option value="ToDo">ToDo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      <table className="table table-striped">
        <thead className="table-primary">
          <tr>
            <th>Title</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Nuk ka detyra</td>
            </tr>
          ) : (
            filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.categoryName}</td>
                <td>{task.status}</td>
                <td>{task.priorityName}</td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;

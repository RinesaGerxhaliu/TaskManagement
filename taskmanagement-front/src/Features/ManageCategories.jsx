import React, { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory} from "./metaService";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null); // { id, name }
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCategoryId, setConfirmCategoryId] = useState(null);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const all = await getCategories();
        setCategories(all.map(c => ({ id: c.id ?? c.Id, name: c.name ?? c.Name })));
      } catch (e) {
        setError("Failed to load categories: " + (e.message || e));
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setActionLoading(true);
    setError("");
    try {
      const created = await createCategory({ Name: newName.trim() });
      const category = {
        id: created.id ?? created.Id,
        name: created.name ?? created.Name
      };
      setCategories(prev => [...prev, category]);
      setNewName("");
      setSuccess("Category added successfully!");
    } catch (e) {
      setError("Failed to create category: " + (e.message || e));
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (category) => {
    setError("");
    setEditing({ id: category.id, name: category.name });
  };

  const handleSave = async () => {
    if (!editing || !editing.name.trim()) return;
    setActionLoading(true);
    setError("");
    try {
      await updateCategory(editing.id, { Name: editing.name.trim() });
      setCategories(prev =>
        prev.map(c => (c.id === editing.id ? { id: editing.id, name: editing.name.trim() } : c))
      );
      setEditing(null);
      setSuccess("Category updated successfully!");
    } catch (e) {
      setError("Failed to update category: " + (e.message || e));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setError("");
  };

  const confirmDelete = (id) => {
    setConfirmCategoryId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    setError("");
    try {
      await deleteCategory(confirmCategoryId);
      setCategories(prev => prev.filter(c => c.id !== confirmCategoryId));
      setSuccess("Category deleted successfully!");
    } catch (e) {
      setError("Failed to delete category: " + (e.message || e));
    } finally {
      setActionLoading(false);
      setShowConfirm(false);
      setConfirmCategoryId(null);
    }
  };
  return (
<div className="container my-5">
  <div className="card shadow-sm">
    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Manage Categories</h5>
      <div className="input-group w-50">
        <input
          type="text"
          className="form-control"
          placeholder="New category name..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          disabled={actionLoading}
        />
        <button
          type="button"
          className="btn btn-light"
          onClick={handleCreate}
          disabled={!newName.trim() || actionLoading}
        >
          <FaPlus />
        </button>
      </div>
    </div>
    <div className="card-body p-3">
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {showConfirm && (
        <div className="alert alert-warning d-flex justify-content-between align-items-center">
          <span>Are you sure you want to delete this category?</span>
          <div>
            <button
              className="btn btn-danger btn-sm me-2"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              Delete
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowConfirm(false)}
              disabled={actionLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className="text-center py-4">Loading...</td>
            </tr>
          ) : categories.length === 0 ? (
            <tr>
              <td colSpan="2" className="text-center py-4 text-muted">No categories found.</td>
            </tr>
          ) : (
            categories.map(category => (
              <tr key={category.id}>
                <td className="align-middle">
                  {editing?.id === category.id ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editing.name}
                      onChange={e =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      disabled={actionLoading}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="text-end align-middle">
                  {editing?.id === category.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-success me-2"
                        onClick={handleSave}
                        disabled={actionLoading}
                      >
                        <FaSave />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancel}
                        disabled={actionLoading}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => startEdit(category)}
                        disabled={actionLoading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmDelete(category.id)}
                        disabled={actionLoading || showConfirm}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
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
}


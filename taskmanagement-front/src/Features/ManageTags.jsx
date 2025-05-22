import React, { useState, useEffect } from "react";
import { getTags, createTag, updateTag, deleteTag } from "./metaService";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function ManageTags() {
  const [tags, setTags] = useState([]);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null); // { id, name }
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmTagId, setConfirmTagId] = useState(null);

  // Auto-clear success message
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  // Load existing tags on mount
  useEffect(() => {
    async function fetchTags() {
      setLoading(true);
      try {
        const all = await getTags();
        setTags(all.map(t => ({ id: t.id ?? t.Id, name: t.name ?? t.Name })));
      } catch (e) {
        setError("Failed to load tags: " + (e.message || e));
      } finally {
        setLoading(false);
      }
    }
    fetchTags();
  }, []);

  // Create new tag
  const handleCreate = async () => {
    if (!newName.trim()) return;
    setActionLoading(true);
    setError("");
    try {
      // Change Name to name if backend expects that
      const created = await createTag({ Name: newName.trim() });
      const tag = {
        id: created.id ?? created.Id,
        name: created.name ?? created.Name
      };
      setTags(prev => [...prev, tag]);
      setNewName("");
      setSuccess("Tag added successfully!");
    } catch (e) {
      setError("Failed to create tag: " + (e.message || e));
    } finally {
      setActionLoading(false);
    }
  };

  // Begin edit mode
  const startEdit = (tag) => {
    setError("");
    setEditing({ id: tag.id, name: tag.name });
  };

  // Save edited tag
  const handleSave = async () => {
    if (!editing || !editing.name.trim()) return;
    setActionLoading(true);
    setError("");
    try {
      await updateTag(editing.id, { Name: editing.name.trim() });
      setTags(prev =>
        prev.map(t => (t.id === editing.id ? { id: editing.id, name: editing.name.trim() } : t))
      );
      setEditing(null);
      setSuccess("Tag updated successfully!");
    } catch (e) {
      setError("Failed to update tag: " + (e.message || e));
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditing(null);
    setError("");
  };

  // Ask for confirmation
  const confirmDelete = (id) => {
    setConfirmTagId(id);
    setShowConfirm(true);
  };

  // Delete a tag
  const handleDelete = async () => {
    setActionLoading(true);
    setError("");
    try {
      await deleteTag(confirmTagId);
      setTags(prev => prev.filter(tag => tag.id !== confirmTagId));
      setSuccess("Tag deleted successfully!");
    } catch (e) {
      setError("Failed to delete tag: " + (e.message || e));
    } finally {
      setActionLoading(false);
      setShowConfirm(false);
      setConfirmTagId(null);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Manage Tags</h5>
          <div className="input-group w-50">
            <input
              type="text"
              className="form-control"
              placeholder="New tag name..."
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

          {/* Custom delete confirm alert */}
          {showConfirm && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center">
              <span>
                Are you sure you want to delete this tag?
              </span>
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
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-muted">No tags found.</td>
                </tr>
              ) : (
                tags.map(tag => (
                  <tr key={tag.id}>
                    <td className="align-middle">
                      {editing?.id === tag.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editing.name}
                          onChange={e => setEditing({ ...editing, name: e.target.value })}
                          disabled={actionLoading}
                        />
                      ) : (
                        tag.name
                      )}
                    </td>
                    <td className="text-end align-middle">
                      {editing?.id === tag.id ? (
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
                            onClick={() => startEdit(tag)}
                            disabled={actionLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(tag.id)}
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

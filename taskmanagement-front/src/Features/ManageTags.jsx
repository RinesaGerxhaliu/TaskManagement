import React, { useState, useEffect } from "react";
import { getTags, createTag, updateTag, deleteTag } from "./metaService";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function ManageTags() {
  const [tags, setTags]       = useState([]);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null); // { id, name }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const all = await getTags();
        setTags(all);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const created = await createTag({ Name: newName.trim() });
      setTags(t => [...t, created]);
      setNewName("");
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = tag => setEditing({ id: tag.id, name: tag.name });

  const handleSave = async () => {
    if (!editing.name.trim()) return;
    try {
      const updated = await updateTag(editing.id, { Name: editing.name.trim() });
      setTags(t => t.map(tag => tag.id === updated.id ? updated : tag));
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => setEditing(null);

  const handleDelete = async id => {
    if (!window.confirm("Delete this tag?")) return;
    try {
      await deleteTag(id);
      setTags(t => t.filter(tag => tag.id !== id));
    } catch (e) {
      console.error(e);
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
            />
            <button
              className="btn btn-light"
              onClick={handleCreate}
              disabled={!newName.trim()}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="2" className="text-center py-4">Loading...</td></tr>
              ) : tags.length === 0 ? (
                <tr><td colSpan="2" className="text-center py-4 text-muted">No tags found.</td></tr>
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
                        />
                      ) : (
                        tag.name
                      )}
                    </td>
                    <td className="text-end align-middle">
                      {editing?.id === tag.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={handleSave}
                          ><FaSave /></button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={handleCancel}
                          ><FaTimes /></button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEdit(tag)}
                          ><FaEdit /></button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(tag.id)}
                          ><FaTrash /></button>
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

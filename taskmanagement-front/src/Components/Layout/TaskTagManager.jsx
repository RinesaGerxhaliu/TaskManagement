import React, { useState, useEffect } from "react";
import {
    getTags,
    getTaskTags,
    addTaskTag,
    removeTaskTag
} from "../../Features/metaService";

export default function TaskTagManager({
    taskId,
    showBadges = true,
    showDropdown = true,
    refreshKey = 0,
    onTagAdded
}) {
    const [assigned, setAssigned] = useState([]);
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        getTags().then(setAllTags).catch(console.error);
        getTaskTags(taskId).then(setAssigned).catch(console.error);
    }, [taskId, refreshKey]);

    const available = allTags.filter(t =>
        !assigned.some(a => a.tagId === t.id)
    );

    const onAdd = async e => {
        const tagId = Number(e.target.value);
        if (!tagId) return;
        const newLink = await addTaskTag(taskId, tagId);
        setAssigned(a => [...a, newLink]);
        onTagAdded?.();
        e.target.value = "";
    };

    const onRemove = async tagId => {
        await removeTaskTag(taskId, tagId);
        setAssigned(a => a.filter(x => x.tagId !== tagId));
    };

    return (
        <div>
            {showBadges && assigned.map(({ tagId, tagName }) => (
                <span key={tagId} className="badge bg-secondary me-1">
                    {tagName}
                    <button
                        className="btn-close btn-close-white btn-sm ms-1"
                        onClick={() => onRemove(tagId)}
                    />
                </span>
            ))}

            {showDropdown && (
                <select
                    className="form-select form-select-sm d-inline-block ms-2"
                    style={{ width: "auto" }}
                    onChange={onAdd}
                    defaultValue=""
                >
                    <option value="" disabled>+ Tag</option>
                    {available.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            )}
        </div>
    );
}

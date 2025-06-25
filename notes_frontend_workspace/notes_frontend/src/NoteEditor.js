import React, { useState, useEffect } from "react";
import "./NoteEditor.css";

// PUBLIC_INTERFACE
export default function NoteEditor({ open, onClose, onSave, note, loading }) {
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");

  useEffect(() => {
    setTitle(note ? note.title : "");
    setContent(note ? note.content : "");
  }, [note, open]);

  if (!open) return null;

  // Modal background click closes editor
  const handleBackdrop = (e) => {
    if (e.target.className === "modal-backdrop") onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="note-editor-modal">
        <h2>{note ? "Edit Note" : "New Note"}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (title.trim()) onSave({ title, content });
          }}>
          <div className="form-group">
            <label>Title</label>
            <input
              required
              type="text"
              value={title}
              autoFocus
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              maxLength={5000}
              disabled={loading}
            />
          </div>
          <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!title.trim() || loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

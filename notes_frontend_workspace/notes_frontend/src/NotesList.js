import React from "react";

// PUBLIC_INTERFACE
export default function NotesList({ notes, onEdit, onDelete, onSelect, selectedId }) {
  // Notes sorted by most recent first (assuming notes have an 'updated_at' or 'created_at')
  const sorted = [...notes].sort((a, b) =>
    new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
  );

  return (
    <ul className="notes-list">
      {sorted.map(note =>
        <li
          key={note.id}
          className={selectedId === note.id ? "note-card selected" : "note-card"}
          onClick={() => onSelect?.(note)}
        >
          <div className="note-title-row">
            <span className="note-title">{note.title}</span>
            <span style={{flex:1}}></span>
            <button className="icon-btn"
              title="Edit"
              onClick={e => {
                e.stopPropagation();
                onEdit(note);
              }}
            >
              &#9998;
            </button>
            <button className="icon-btn"
              title="Delete"
              onClick={e => {
                e.stopPropagation();
                if (window.confirm("Delete this note?")) onDelete(note);
              }}
            >
              &#10006;
            </button>
          </div>
          {note.content && <div className="note-content-snippet">
            {note.content.length > 120
              ? note.content.slice(0, 120) + "..." : note.content}
          </div>}
          <div className="note-meta">
            <span>
              {(note.updated_at || note.created_at || "").slice(0,19).replace("T"," ")}
            </span>
          </div>
        </li>
      )}
    </ul>
  );
}

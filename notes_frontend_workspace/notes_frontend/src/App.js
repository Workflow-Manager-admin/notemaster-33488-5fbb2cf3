import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import "./App.notesui.css";
import Sidebar from "./Sidebar";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote
} from "./api";

// PUBLIC_INTERFACE
function App() {
  // State for notes, current editor, search
  const [notes, setNotes] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load notes list (optionally with search)
  const loadNotes = useCallback(async (q="") => {
    setLoading(true);
    try {
      const data = await fetchNotes(q);
      setNotes(data || []);
      // If deleted note was selected, reset sidebar selection
      if (selectedNoteId && !data.find(n => n.id === selectedNoteId)) {
        setSelectedNoteId(null);
      }
      setError("");
    } catch (e) {
      setError("Could not fetch notes: " + (e?.message || e));
      setNotes([]);
    }
    setLoading(false);
  }, [selectedNoteId]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  // Open editor for new or edit + after save
  const openNew = () => { setEditingNote(null); setEditorOpen(true); };
  const openEdit = (note) => { setEditingNote(note); setEditorOpen(true); };
  const closeEditor = () => { setEditorOpen(false); setEditingNote(null); };
  const handleSave = async (fields) => {
    setSaving(true);
    try {
      if (!editingNote) {
        await createNote(fields);
      } else {
        await updateNote(editingNote.id, fields);
      }
      closeEditor();
      setSearch(""); setSearchInput("");
      await loadNotes();
    } catch (e) {
      alert("Failed to save note: " + (e?.message || e));
    }
    setSaving(false);
  };

  const handleDelete = async (note) => {
    try {
      await deleteNote(note.id);
      await loadNotes();
    } catch (e) {
      alert("Failed to delete note: " + (e?.message || e));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    loadNotes(searchInput);
  };

  return (
    <div>
      <div className="header-bar">
        <div className="header-title">Notemaster</div>
        <button
          className="header-btn"
          onClick={openNew}
        >+ New Note</button>
        <div style={{flex:1}}></div>
        <form className="search-bar" style={{margin:0}} onSubmit={handleSearch}>
          <input
            className="search-input"
            type="search"
            placeholder="Search notes..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            disabled={loading}
          />
          <button className="search-btn" type="submit" disabled={loading}>Search</button>
        </form>
      </div>
      <Sidebar>
        {/* Expand sidebar in future */}
      </Sidebar>
      <main className="main-content" style={{ minHeight: "86vh"}}>
        {error &&
          <div style={{ color: "red", marginTop: '18px', fontSize: '1.05rem' }}>
            {error}
          </div>
        }
        <div>
          <NotesList
            notes={notes}
            onEdit={openEdit}
            onDelete={handleDelete}
            onSelect={n => setSelectedNoteId(n.id)}
            selectedId={selectedNoteId}
          />
          {loading && (
            <div style={{margin: "18px 0", color: "#888"}}>Loading...</div>
          )}
          {!loading && !notes.length && (
            <div style={{margin: "22px 0", color: "#aaa", fontSize: "1.1rem"}}>
              No notes found. Click &quot;+ New Note&quot; to get started!
            </div>
          )}
        </div>
      </main>
      <NoteEditor
        open={editorOpen}
        note={editingNote}
        onClose={closeEditor}
        onSave={handleSave}
        loading={saving}
      />
    </div>
  );
}

export default App;
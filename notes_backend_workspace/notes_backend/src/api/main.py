from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4, UUID


# PUBLIC_INTERFACE
class NoteBase(BaseModel):
    """Base model for a note, containing title and content fields."""

    title: str = Field(..., description="Title of the note")
    content: str = Field(..., description="Content of the note")


# PUBLIC_INTERFACE
class NoteCreate(NoteBase):
    """Model for creating a note."""

    pass


# PUBLIC_INTERFACE
class NoteUpdate(BaseModel):
    """Model for updating a note, all fields optional."""

    title: Optional[str] = Field(None, description="New title for the note")
    content: Optional[str] = Field(None, description="New content for the note")


# PUBLIC_INTERFACE
class Note(NoteBase):
    """Complete note model, including its UUID."""

    id: UUID = Field(..., description="Unique ID of the note")


tags_metadata = [
    {
        "name": "Notes",
        "description": (
            "Operations for creating, reading, updating, deleting & searching notes."
        ),
    }
]

app = FastAPI(
    title="Notes Backend API",
    description="FastAPI backend for a modern notes app. Handles CRUD & search for notes.",
    version="1.0.0",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. For prod, restrict.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory "database"
notes_db: dict[UUID, Note] = {}


def _search_notes(query: str) -> List[Note]:
    """Helper to search notes by title or content (case-insensitive)."""
    q = query.lower()
    return [
        note
        for note in notes_db.values()
        if q in note.title.lower() or q in note.content.lower()
    ]


@app.get(
    "/",
    summary="Health Check",
    description="Health check endpoint for the Notes API.",
    tags=["Notes"],
)
# PUBLIC_INTERFACE
def health_check():
    """Returns a message for health check."""
    return {"message": "Healthy"}


@app.post(
    "/notes",
    response_model=Note,
    status_code=201,
    summary="Create a note",
    description="Create and store a new note.",
    tags=["Notes"],
)
# PUBLIC_INTERFACE
def create_note(note: NoteCreate):
    """Creates a new note with a unique UUID."""
    note_id = uuid4()
    note_obj = Note(id=note_id, title=note.title, content=note.content)
    notes_db[note_id] = note_obj
    return note_obj


@app.get(
    "/notes",
    response_model=List[Note],
    summary="List/Search notes",
    description=(
        "List all notes or search notes by query string (in title or content)."
    ),
    tags=["Notes"]
)
# PUBLIC_INTERFACE
def list_or_search_notes(
    q: Optional[str] = Query(None, description="Query to search notes by title or content")
):
    """
    Returns all notes if no query (`q`). If `q` is provided, returns notes containing the query
    in title or content, case-insensitive.
    """
    if q is None or q.strip() == "":
        return list(notes_db.values())
    return _search_notes(q)


@app.get(
    "/notes/{note_id}",
    response_model=Note,
    summary="Get a note",
    description="Fetch a note by its unique ID.",
    tags=["Notes"]
)
# PUBLIC_INTERFACE
def get_note(note_id: UUID):
    """Get a single note by its UUID."""
    note = notes_db.get(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.put(
    "/notes/{note_id}",
    response_model=Note,
    summary="Update a note",
    description="Update a note's title or content by ID.",
    tags=["Notes"]
)
# PUBLIC_INTERFACE
def update_note(note_id: UUID, note_update: NoteUpdate):
    """
    Updates a note's title or content. At least one must be provided.
    """
    note = notes_db.get(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    update_data = note_update.dict(exclude_unset=True)
    updated_note = note.copy(update=update_data)
    notes_db[note_id] = updated_note
    return updated_note


@app.delete(
    "/notes/{note_id}",
    response_model=None,
    status_code=204,
    summary="Delete a note",
    description="Delete a note by its unique ID.",
    tags=["Notes"]
)
# PUBLIC_INTERFACE
def delete_note(note_id: UUID):
    """Deletes a note by UUID."""
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    del notes_db[note_id]
    return JSONResponse(status_code=204, content=None)

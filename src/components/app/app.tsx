import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Container } from "react-bootstrap";
import { NewNote } from "../../futures/note/note";
import { invoke } from '@tauri-apps/api/tauri'
import { NoteList } from "../../futures/note/list/note-list";
import { NoteData } from "../note/note-data";
import { Tag } from "../note/tag";
import "./app.css"
import { Note } from "../note/note";
import { NoteLayout } from "../note/layout/note-layout";
import { NoteView } from "../../futures/note/view/note-view";
import { EditNote } from "../../futures/note/edit/note-edit";
import { v4 as uuidV4 } from "uuid"

function App() {

  const [tags, setTags] = useState<Tag[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  async function onCreateNote(data: NoteData) {
    var newNote: Note = {
      id: uuidV4(),
      ...data
    }
    console.log(newNote)
    setNotes(prev => [...prev, newNote])
    await invoke('create_note', { note: newNote }).catch((e) => console.error(e))
  }

  async function onEditNote(id: string, editData: NoteData) {
    console.log("new data : ", editData)
    var editNote: Note = {
      id: id,
      ...editData
    }
    invoke('edit_note', { note: editNote })
      .then(() => getAvailableNotes())
      .catch((e) => console.error(e))
  }

  async function onDeleteNote(id: string) {
    if (notes.length === 1){
      console.log("inside")
      setNotes([])
      await invoke('delete_note', { id: id })
      .catch((e) => console.error(e))
    }
    await invoke('delete_note', { id: id })
      .then(() => getAvailableNotes())
      .catch((e) => console.error(e))
    console.log(notes)
  }

  async function onDeleteTag(id: string) {
    invoke('delete_tag', { id: id })
      .then(() => getAvailableTags())
      .catch((e) => console.error(e))
  }

  function onEditTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function completeEditTag(id: string, label: string) {
    var editTag: Tag = {
      id: id,
      label: label
    }
    console.log(editTag)
    invoke('edit_tag', { tag: editTag })
      .then(() => getAvailableTags())
      .catch((e) => console.error(e))

  }


  function getAvailableTags() {
    invoke('load_tags').then((tags) => {
      if (isNonEmptyArrayOfTags(tags)) {
        setTags(tags)
      }
    });
  }

  function getAvailableNotes() {
    console.log("get notes")
    invoke('load_notes').then((notes) => {
      if (isNonEmptyArrayOfNotes(notes)) {
        console.log(notes)
        setNotes(notes)
      }
    });
  }

  useEffect(() => {
    getAvailableTags()
    getAvailableNotes()
  }, []);

  function isNonEmptyArrayOfTags(value: unknown): value is Tag[] {
    return Array.isArray(value) &&
      value.length > 0 &&
      value.every(item => (
        item as Tag).id !== undefined && (item as Tag).label !== undefined
      )
  }

  function isNonEmptyArrayOfNotes(value: unknown): value is Note[] {
    return Array.isArray(value) &&
      value.length > 0 &&
      value.every(item =>
        (item as Note).id !== undefined &&
        (item as Note).tags !== undefined &&
        (item as Note).markdown !== undefined &&
        (item as Note).title !== undefined
      )
  }

  async function onCreateTag(newTag: Tag) {
    console.log(newTag)
    await invoke('create_tag', { tag: newTag }).catch((e) => console.error(e));
    setTags(prev => [...prev, newTag])
  }

  return (
    <Container className="main-c" fluid>
      <Routes>
        <Route path="/" element={<NoteList notes={notes} availableTags={tags} onDeleteTag={onDeleteTag} onEditTag={onEditTag} completeEdit={completeEditTag}/>} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onCreateTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notes} />}>
          <Route index element={<NoteView onDelete={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit={onEditNote} onAddTag={onCreateTag} availableTags={tags} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;


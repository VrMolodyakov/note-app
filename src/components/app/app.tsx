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

function App() {

  const [tags, setTags] = useState<Tag[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const location = useLocation();

  async function onCreateNote(data: NoteData) {
    var newNote:Note = {
      id:uuidV4(),
      ...data
    }
    console.log(newNote)
    setNotes(prev => [...prev, newNote])
    await invoke('create_note', { note: newNote }).catch((e) => console.error(e))
  }

  async function onEditNote(id:string,edit: NoteData){
    console.log("new data : ",edit)
    await invoke('edit_note',{note:edit}).catch((e) => console.error(e))
  }

  function getAvailableTags() {
    invoke('load_tags').then((tags) => {
      if (isNonEmptyArrayOfTags(tags)) {
        setTags(tags)
      }
    });
  }

  function getAvailableNotes() {
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
        <Route path="/" element={<NoteList notes={notes} availableTags={tags} />} />
        <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onCreateTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notes}/> }>
          <Route index element={<NoteView/>} />
          <Route path="edit" element={<EditNote onSubmit={onEditNote} onAddTag={onCreateTag} availableTags={tags}/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
function uuidV4(): string {
  throw new Error("Function not implemented.");
}


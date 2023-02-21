import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Container } from "react-bootstrap";
import { NewNote } from "../../futures/note/note";
import { invoke } from '@tauri-apps/api/tauri'
import { NoteList } from "../../futures/note/list/note-list";
import { NoteData } from "../note/note-data";
import { Tag } from "../note/tag";

function App() { 

  const [tags,SetTags] = useState<Tag[]>([])

  async function onCreateNote(data:NoteData){
    console.log(data)
    await invoke('create_note_command', {note:data}).catch((e) => console.error(e));
  }

  async function onCreateTag(data:Tag){

  }

  return (
    <Container className="main-c">
      <Routes>
        <Route path = "/" element = {<NoteList availableTags={tags}/>} />
        <Route path = "/new" element = {<NewNote onSubmit={onCreateNote} onAddTag={onCreateTag} availableTags={tags} />} />
        <Route path = "/:id">
          <Route index element = {<h1>Index</h1>} />
          <Route path = "edit" element = {<h1>Edit</h1>} />
        </Route>
        <Route path = "*" element = {<Navigate to = "/"/>} />
      </Routes>
    </Container>
  );
}

export default App;

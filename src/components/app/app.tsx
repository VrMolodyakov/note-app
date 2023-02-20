import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Container } from "react-bootstrap";
import { NewNote } from "../../futures/note/note";
import { NoteData } from "../note/note";
import { invoke } from '@tauri-apps/api/tauri'
import { NoteList } from "../../futures/note/list/note-list";

function App() { 

  const navigate = useNavigate();
  useEffect(() => {
    navigate("/new");
  }, []);  

  async function onCreateNote(data:NoteData){
    console.log(data)
    await invoke('create_note_command', {note:data}).catch((e) => console.error(e));
  }

  return (
    <Container className="main-c">
      <Routes>
        <Route path = "/" element = {<NoteList/>} />
        <Route path = "/new" element = {<NewNote onSubmit={onCreateNote} />} />
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

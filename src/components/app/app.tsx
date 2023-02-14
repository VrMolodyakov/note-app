import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Container } from "react-bootstrap";
import { NewNote } from "../../futures/note/note";
import { NoteData } from "../note/note";


function App() { 

  const navigate = useNavigate();
  useEffect(() => {
    navigate("/new");
  }, []);  

  function onCreateNote(data:NoteData){
    console.log(data)
  }

  return (
    <Container className="main-c">
      <Routes>
        <Route path = "/" element = {<h1>Hi there</h1>} />
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

import "bootstrap/dist/css/bootstrap.min.css"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/new");
  }, []);  
  return (
    <div>
    <Routes>
      <Route path = "/" element = {<h1>Hi there</h1>} />
      <Route path = "/new" element = {<h1>New</h1>} />
    </Routes>
    </div>
  );
}

export default App;

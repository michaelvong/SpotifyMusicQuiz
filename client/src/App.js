import './App.css';
import React, { useState, useEffect } from "react";
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
  const [message, setMessage] = useState("");

  const code = new URLSearchParams(window.location.search).get("code");

  return (
    code ? <Dashboard code={code}/> : <Login /> 
    
  );
}

export default App;

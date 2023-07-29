import './App.css';
import React, { useState, useEffect } from "react";
import Dashboard from './Dashboard';
import Login from './Login';

function App() {

  const code = new URLSearchParams(window.location.search).get("code");

  return (
    <div className="App">
      {code ? <Dashboard code={code}/> : <Login /> }
    </div>
  );
}

export default App;

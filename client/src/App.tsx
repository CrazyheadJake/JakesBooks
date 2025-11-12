import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.text))
      .catch((err) => console.error(err));
  }, []);

  return (
  <div>
    <h1>React + Express</h1>
    <p>{message || "Loading..."}</p>
  </div>
  );
}

export default App

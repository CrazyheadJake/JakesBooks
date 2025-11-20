import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./templates/Navbar";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import './App.css'

function App() {
  const [loggedIn, setLogin] = useState(false);

  // useEffect(() => {
  //   fetch("/api/message")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.text))
  //     .catch((err) => console.error(err));
  // }, []);
  return (
    <Router>
      <Navbar isLoggedIn={loggedIn} />
      <div className="container-fluid">
        <Routes>
          <Route
            path="/"
            element={loggedIn ? <Home />: <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login setLogin={(x: boolean) => setLogin(x)} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App

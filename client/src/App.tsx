import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./templates/Navbar";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Logout from "./pages/Logout"
import ResetPassword from "./pages/ResetPassword"
import './App.css'

function App() {
  const [loggedIn, setLogin] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/checkAuth", {
        credentials: "include"
      });
      const data = await res.json();
      setLogin(data.loggedIn);
    }
  
  checkAuth();
  }, []);
  useEffect(() => {
    console.log("loggedIn changed:", loggedIn);
  }, [loggedIn]);

  return (
    <Router>
      <Navbar isLoggedIn={loggedIn} error={error}/>
      <div className="container-fluid p-0">
        <Routes>
          <Route
            path="/"
            element={loggedIn ? <Home setError={setError} />: loggedIn !== null ? <Navigate to="/login" replace /> : <></>}
          />
          <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login setLogin={setLogin} setError={setError}/>} />
          <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Signup setLogin={setLogin} setError={setError}/>} />
          <Route path="/logout" element={<Logout setLogin={(x: boolean) => setLogin(x)} />} />
          <Route path="/reset-password" element={<ResetPassword setError={setError}/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App

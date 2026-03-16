import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./templates/Navbar";
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Logout from "./pages/Logout"
import ResetPassword from "./pages/ResetPassword"
import RequestPasswordReset from "./pages/RequestPasswordReset"
import './App.css'
import type { Book } from './types/book';

function App() {
  const [loggedIn, setLogin] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [ books, setBooks ] = useState<Book[]>([]);

  // Check authentication status on mount and whenever loggedIn changes to true (e.g. after login/signup)
  useEffect(() => {
    console.log("loggedIn changed:", loggedIn);
    async function checkAuth() {
      const res = await fetch("/api/getBooks", {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        setLogin(false);
        return;
      }
      setLogin(true);
      const data = await res.json();
      setBooks(data);
    }
    if (loggedIn !== false)
      checkAuth();
  }, [loggedIn]);

  return (
    <Router>
      <Navbar isLoggedIn={loggedIn} error={error}/>
      <div className="container-fluid p-0">
        <Routes>
          <Route
            path="/"
            element={loggedIn ? <Home books={books} setBooks={setBooks} />: loggedIn !== null ? <Navigate to="/login" replace /> : <></>}
          />
          <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <Login setLogin={setLogin} setError={setError}/>} />
          <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <Signup setLogin={setLogin} setError={setError}/>} />
          <Route path="/logout" element={<Logout setLogin={setLogin} />} />
          <Route path="/reset-password" element={<ResetPassword setError={setError} setLogin={setLogin}/>} />
          <Route path="/request-reset" element={<RequestPasswordReset setError={setError}/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Components/Navbar';

import Home from './Pages/Home/Home';
import Questions from './Pages/Quiz/Questions';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TicTacToeGame from './Pages/TicTacToe/TicTacToe';

import './App.css';

function App() {
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3001/logout', { withCredentials: true });
      window.location.reload()
      setLoggedOut(true);
    } catch (error) {
      console.error("Error logging out:", error.response.data.error);
    }
  }

  return (
    <Router>
      <div className="App">
        <Navbar handleLogout={handleLogout} />

        {loggedOut && <Navigate to="/" />}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tictactoe" element={<TicTacToeGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

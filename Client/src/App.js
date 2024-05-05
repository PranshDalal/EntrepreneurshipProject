import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes, Redirect } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Components/Navbar';

import Home from './Pages/Home/Home';
import Questions from './Pages/Quiz/Questions';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TicTacToeGame from './Pages/TicTacToe/TicTacToe';

import './App.css';

function App() {
  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/logout', { withCredentials: true });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error logging out:", error.response.data.error);
    }
  }



  return (
    <Router>
      <div className="App">
        <Navbar handleLogout={handleLogout} />

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
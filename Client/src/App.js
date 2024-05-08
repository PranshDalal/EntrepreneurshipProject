import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";

import Navbar from './Components/Navbar';

import Home from './Pages/Home/Home';
import Questions from './Pages/Quiz/Questions';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TicTacToeGame from './Pages/TicTacToe/TicTacToe';
import Leaderboard from './Pages/Leaderboard/Leaderboard';
import Hangman from './Pages/Hangman/Hangman';
import Streak from './Pages/Streak/Streak';

import './App.css';

export const AuthContext = createContext();

function App() {
  const sessionCookieExists = Cookies.get('session') !== undefined;
  const [loggedIn, setLoggedIn] = useState(sessionCookieExists);
  const [points, setPoints] = useState('');

  useEffect(() => {
    getPoints();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:3001/logout', { withCredentials: true });
      setLoggedIn(false);

    } catch (error) {
      console.error("Error logging out:", error.response.data.error);
    }
  }

  const getPoints = async () => {
    if (loggedIn) {
      try {
        const response = await axios.get('http://localhost:3001/points', { withCredentials: true });
        setPoints(response.data.points);
      } catch (error) {
        console.error("Error fetching points", error);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Router>
        <div className="App">
          <Navbar loggedIn={loggedIn} handleLogout={handleLogout} userPoints={points} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path="/tictactoe" element={<TicTacToeGame />} />
            <Route path="/hangmangame" element={<Hangman />} />
            <Route path="/streak" element={<Streak />} />

          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

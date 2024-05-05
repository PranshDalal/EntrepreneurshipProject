import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import axios from 'axios';

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
        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/" activeclassname="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/questions" activeclassname="active">
                Quiz
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" activeclassname="active">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" activeclassname="active">
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/tictactoe" activeclassname="active">
                Tic Tac Toe
              </NavLink>
            </li>
            <li>
              <button className="sign-out-btn" onClick={handleLogout}>Sign Out</button>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />}  />
          <Route path="/login" element={<Login />}  />
          <Route path="/register" element={<Register />}  />
          <Route path="/tictactoe" element={<TicTacToeGame />}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
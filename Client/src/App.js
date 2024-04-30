import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

import Home from './Components/Home/Home';
import Questions from './Components/Quiz/Questions';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';

import './App.css';

function App() {
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
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />}  />
          <Route path="/login" element={<Login />}  />
          <Route path="/register" element={<Register />}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

//Importing all the components
import Home from './Components/Home';
import Questions from './Components/Questions';


//Importing CSS file
import './App.css';

//Creating navbar using Router
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
                Questions
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
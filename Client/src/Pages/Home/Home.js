import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="content-container">
        <h1 className="home-title">Welcome to Quiz Quest</h1>

        <p className="home-subtitle">Embark on an Exciting Journey of Knowledge!</p>

        <Link to="/register" className="get-started-button">Get Started</Link>
      </div>
    </div>
  );
};

export default Home;

import { AuthContext } from '../../App';

import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const { loggedIn } = React.useContext(AuthContext);

  const guestPage = (
    <>
      <h1 className="home-title">Welcome to Quiz Quest</h1>

      <p className="home-subtitle">Embark on an Exciting Journey of Knowledge!</p>

      <Link to="/register" className="get-started-button">Get Started</Link>
    </>
  );

  const loggedInPage = (
    <>
      <h1 className="home-title">Welcome back!</h1>

      <p className="home-subtitle">Your journey continues...</p>

      <Link to="/questions" className="get-started-button">Continue</Link>
    </>
  )

  return (
    <div className="home-container">
      <div className="content-container">
        {loggedIn ? loggedInPage : guestPage}
      </div>
    </div>
  );
};

export default Home;

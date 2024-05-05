import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/login',
        { username, password },
        { withCredentials: true } 
      );
      setLoginStatus(response.data.status); 
      navigate('/');
      window.location.reload()
    } catch (error) {
      setLoginStatus(error.response.data.error); 
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {loginStatus && <p>{loginStatus}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="login-input" />
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;

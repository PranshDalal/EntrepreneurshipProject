import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/common.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      setLoginStatus(response.data.status);
    } catch (error) {
      setLoginStatus(error.response.data.error);
    }
  };

  return (
    <div class="register-login-container">
      <h2>Login</h2>
      {loginStatus && <p>{loginStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div class="bottom-margin-rem-1">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} class="input-field" />
        </div>
        <div class="bottom-margin-rem-1">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} class="input-field" />
        </div>
        <button type="submit" class="button center">Login</button>
      </form>
      <div class="top-margin-rem-1 center">
        Don't have an account? <Link to="/register" class="link">Register</Link>
      </div>
    </div>
  );
};

export default Login;

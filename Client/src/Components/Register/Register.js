import React, { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import '../../styles/common.css'

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:3001/signup', { email, password });
        setRegisterStatus(response.data.status);
    } catch (error) {
        setRegisterStatus(error.response.data.error);

    }
  };

  return (
    <div class="register-login-container">
      <h2>Register</h2>
      {registerStatus && <p>{registerStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div class="bottom-margin-rem-1">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} class="input-field" />
        </div>
        <div class="bottom-margin-rem-1">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} class="input-field" />
        </div>
        <button type="submit" class="button">Register</button>
      </form>
      <div class="top-margin-rem-1 center">
        Already have an account? <Link to="/login" class="link">Login</Link>
      </div>
    </div>
  );
};

export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/signup',
        { email, password, username },
        { withCredentials: true } 
      );
      setRegisterStatus(response.data.status);
      navigate('/');
      window.location.reload()
    } catch (error) {
      setRegisterStatus(error.response.data.error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {registerStatus && <p>{registerStatus}</p>}
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="register-input" />
        </div>
        <div>
          <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="register-input" />
        </div>
        <div>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="register-input" />
        </div>

        <button type="submit" className="register-button">Register</button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { getUserFromToken } from '../utitlity/auth';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`${API_URL}/user/login`, { email, password });

      // Store token
      localStorage.setItem('token', res.data.data);

      // Decode token
      // const user = getUserFromToken();
      // console.log('Logged in user:', user);

      setMessage({ type: 'success', text: res.data.message });

      // Redirect after a delay
      setTimeout(() => navigate('/home'), 2000);
    } 
    catch (err) {
      const errorMsg = err.response?.data || 'Something went wrong';
      setTimeout(() => {
        setMessage({ type: 'error', text: errorMsg });
        setTimeout(() => {
          setMessage('');
        }, 1000);
      }, 500);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter your password" 
          required
        />
        <button type="submit">Login</button>
      </form>
      {message.text && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
          {message.text}
        </p>
      )}
      <div>
        <Link to='/signup'>Don't have an account ? click here to create account.</Link>
      </div>
    </div>
  );
};

export default Login;

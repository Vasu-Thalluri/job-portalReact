import React from 'react'
import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Signup = ()=> {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [messsage, setMessage] = useState({type:'', msg:''});
  //const [error, setError] = useState('');
  //const dispatch = useDispatch();

  const handleSignup = (e)=> {
    e.preventDefault();
    createUser();
  }

  async function createUser() {
    try {
      //const usersRes = await axios.get(`${API_URL}/users`);
      //const matchedUser = usersRes.data.find(user => user.UserEmail === email);
      //if (!matchedUser) {
        // const params = {};
        // params['UserName'] = name;
        // params['UserEmail'] = email;
        // params['UserPassword'] = password;    
      const res = await axios.post(`${API_URL}/user/create`, {username:name, email:email, password:password, role:role});
      console.log(res);
      if (res) {
        setMessage({type:'success', msg: res.data.message});
        setTimeout(() => {
          setName('');
          setEmail('');
          setPassword('');
          setRole('');
          setMessage({type:'', msg:''});
        }, 2000); // Clear after 2 seconds
      }
      //dispatch(login({email}));
    }catch(error) {
      console.error('Signup failed:', error);
      const errMsg = error.response.data.message
      setMessage({type:'error', msg:errMsg});
      setTimeout(() => {
        setMessage({type:'', msg:''});
      }, 2000);
    }
  }

  return (
    <div>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="userName">
              Name:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
              <input type='text' name='name' id='userName' placeholder='Enter Your Name' required value={name} onChange={(e)=> setName(e.target.value)}/>
            </label>
            
          </div>
          <div>
            <label htmlFor="userEmail">
              Email:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
              <input type='email' name='email' id='userEmail' placeholder='Enter Your Email' required value={email} onChange={(e)=> setEmail(e.target.value)}/>
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password:<span style={{ color: "red", marginLeft: "2px" }}>*</span>
              <input type='password' name='password' id='password' placeholder='Enter Your password' required value={password} onChange={(e)=> setPassword(e.target.value)}/>
            </label>
          </div>
          <div>
            <label htmlFor="role">
              Role:
              <input type='role' name='role' id='role' placeholder='Enter as user or admin' value={role} onChange={(e)=> setRole(e.target.value)}/>
            </label>
          </div>
          <div>
            <button type='submit'>Signup</button> <br />
          </div>
          {messsage.msg && <p style={{color: messsage.type==='error' ? 'red' : 'green'}}>{messsage.msg}</p>}
          {/* {error && <p style={{color: 'red'}}>{error}</p>} */}
          <div>
            <Link to="/">Click here to continue Login</Link>
          </div> 
        </form>
    </div>
  )
} 
export default Signup;

//import { useState } from 'react'
import './App.css'
import {Routes, Route, useLocation} from 'react-router-dom';
import Signup from './pages/signup';
import Login from './pages/login';
import Home from './pages/home';
import Navbar from './navbar/navbar';
import PostJob from './components/postJob';
import ApplyToJob from './components/applyToJob';
import Company from './components/company';
import ProtectedRoute from './protectedRoute';

function App() {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/signup'];
  const shouldShowNavbar = token && !hideNavbarRoutes.includes(location.pathname);
  
  return (
    <div>
      {shouldShowNavbar && <Navbar/>}
      <Routes>
        <Route path='/signup' element = {<Signup/>} />
        <Route path='/' element = {<Login/>} />

        <Route path = '/home' element = {
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path='/applyToJob' element = {
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            < ApplyToJob/>
          </ProtectedRoute>
        }/>

        <Route path='/company' element = {
          <ProtectedRoute allowedRoles={['admin']}> 
          < Company/>
          </ProtectedRoute>
        }/>
        <Route path='/postJob' element = {
          <ProtectedRoute allowedRoles={['admin']}> 
            < PostJob/>
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  )
}

export default App

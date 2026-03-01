import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'
import Services from './Services.jsx'
import Stats from './Stats.jsx'
import Project from './Project.jsx'
import Login from './Login.jsx'
import axios from 'axios';
import Contact from './Contact'

// Backend connection setup
axios.defaults.withCredentials = true; 
axios.defaults.baseURL = 'http://localhost:3000';

const App = () => {
  return (
    <Routes>
      {/* Home Page Routes */}
      <Route path="/*" element={
        <div>
          <Navbar/>
          <Hero />
          <Services />
          <Stats />
          <Project />
          <Contact /> 
        </div>
      } />

      {/* Admin Login Page */}
      <Route path="/admin/login" element={<Login />} />
    </Routes>
  )
}

export default App
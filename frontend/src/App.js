import React from 'react';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';


import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

function App() 
{
  const {user} = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
          <div className='pages'>
              <Routes>
                <Route path="/" element={!user ? <Login /> : <Navigate to="/dashboard"/>}/>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard"/>}/>
                <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard"/>}/>
                <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />}/>
              </Routes>
            </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

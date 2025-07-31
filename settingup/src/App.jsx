// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Registration';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      {/* Add a fallback route for undefined paths */}
      <Route path="*" element={<div className="text-center mt-10">404 - Page Not Found</div>} />
    </Routes>
  ); 
} 

export default App;

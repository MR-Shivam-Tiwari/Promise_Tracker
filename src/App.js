import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import AppRoutes from './AppRoutes';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
}




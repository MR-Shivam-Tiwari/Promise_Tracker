import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home';
import AppRoutes from './AppRoutes';

export default function App() {
  const userDataString = localStorage.getItem('userData');
  const userDataObj = userDataString ? JSON.parse(userDataString) : null;
  const [isLoggedIn, setIsLoggedIn] = useState(userDataObj?.token || false);

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    const userDataObj = userDataString ? JSON.parse(userDataString) : null;
    setIsLoggedIn(userDataObj && userDataObj.userId);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/*" element={isLoggedIn ? <AppRoutes /> : <NonAuthContent />} />
        </Routes>
      </Router>
    </div>
  );
}

function NonAuthContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

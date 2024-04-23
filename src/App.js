import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home';
import AppRoutes from './AppRoutes';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Retrieve userData from localStorage
    const userDataString = localStorage.getItem('userData');
    const userDataObj = userDataString ? JSON.parse(userDataString) : null;
    // Update isLoggedIn state based on the presence of userId in userData
    setIsLoggedIn(userDataObj && userDataObj.userId);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Router>
        {isLoggedIn ? <AppRoutes /> : <NonAuthContent />}
      </Router>
    </div>
  );
}

function NonAuthContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    const userDataObj = userDataString ? JSON.parse(userDataString) : null;
    if (userDataObj && userDataObj.userId) {
      // Redirect to /home if userData exists
      navigate('/home');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

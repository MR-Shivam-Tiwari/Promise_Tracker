import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home';
import AppRoutes from './AppRoutes';
import { UserProvider, UserContext } from './global/UserContext';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

function MainApp() {
  const { userData } = useContext(UserContext);
  const isLoggedIn = userData?.token;

  return (
    <div className='lexend-bold'>
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:userId" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

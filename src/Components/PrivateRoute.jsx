import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const userDataString = localStorage.getItem('userData');
  const userDataObj = userDataString ? JSON.parse(userDataString) : null;
  const isLoggedIn = userDataObj?.token || false;
  return isLoggedIn ? Component : <Navigate to="/login" />;
};

export default PrivateRoute;

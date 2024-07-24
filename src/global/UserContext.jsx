import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const userDataString = localStorage.getItem('userData');
  const userDataObj = userDataString ? JSON.parse(userDataString) : null;
  const [userData, setUserDataState] = useState(userDataObj);

  // Custom setter for userData that also updates localStorage
  const setUserData = (data) => {
    localStorage.setItem('userData', JSON.stringify(data));
    setUserDataState(data);
  };

  // useEffect to listen to localStorage changes (e.g., across tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const userDataString = localStorage.getItem('userData');
      const userDataObj = userDataString ? JSON.parse(userDataString) : null;
      setUserDataState(userDataObj);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (data) => {
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
  };

  return (
    <UserContext.Provider value={{ userData, login, logout, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

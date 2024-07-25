import axios from 'axios';
import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
// Create the context
export const UserContext = createContext();


// Create a provider component
export const UserProvider = ({ children }) => {
  const userDataString = localStorage.getItem('userData');
  const userDataObj = userDataString ? JSON.parse(userDataString) : null;
  const [userData, setUserDataState] = useState(userDataObj);

  const fetchUserData =  () => {
    axios.get( 'http://localhost:5000/api/user/'+userData?.userId)
    .then((res)=>{
      if(res.data.active===false){
        setUserData(null)
      }
    }).catch((err)=>{
      console.log(err)
    })

  }

  useEffect(()=>{
    socket.on('user-deactivated', user=>{
      if(userData?.userId) fetchUserData()
    })

    return ()=>{
      socket.off('user-deactivated')
    }
  },[])

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

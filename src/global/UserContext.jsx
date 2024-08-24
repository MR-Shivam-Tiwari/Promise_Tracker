import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);
// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const userDataString = localStorage.getItem("userData");
  const userDataObj = userDataString ? JSON.parse(userDataString) : null;
  const [userData, setUserDataState] = useState(userDataObj);
  const [allTasks, setAllTasks] = useState([]);
  const [userid, setUserid] = useState(
    JSON.parse(userDataString)?.userId || ""
  );
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setUserid(userId);
    }
  }, []);
  const fetchUserData = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/api/user/" + userData?.userId)
      .then((res) => {
        if (res.data.active === false) {
          setUserData(null);
        } else {
          setUserData({ ...userData, ...res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTasksmain = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks`
      );
      const filteredTasks = response.data.filter((task) => {
        const isOwner = task.owner.id === userid;
        const isPerson = task.people.some((person) => person.userId === userid);
        return isOwner || isPerson;
      });

      setAllTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasksmain();
  }, []);
  const roleProtected = async () => {
    return axios
      .get(process.env.REACT_APP_API_URL + "/api/user/" + userData?.userId)
      .then((res) => {
        setUserData({ ...userData, ...res.data });
        return [0, 1].includes(res.data?.userRole);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    socket.on(`user_update${userData?.userId}`, (user) => {
      if (userData?.userId === user?._id) {
        fetchUserData();
      }
    });

    return () => {
      socket.off("user-deactivated");
    };
  }, []);

  // Custom setter for userData that also updates localStorage
  const setUserData = (data) => {
    localStorage.setItem("userData", JSON.stringify(data));
    setUserDataState(data);
  };

  // useEffect to listen to localStorage changes (e.g., across tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const userDataString = localStorage.getItem("userData");
      const userDataObj = userDataString ? JSON.parse(userDataString) : null;
      setUserDataState(userDataObj);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const login = (data) => {
    setUserData(data);
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
  };

  return (
    <UserContext.Provider
      value={{ userData, login, logout, setUserData, roleProtected , allTasks , fetchTasksmain }}
    >
      {children}
    </UserContext.Provider>
  );
};

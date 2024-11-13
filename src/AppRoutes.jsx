import React, { useContext, useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import MyProfile from "./Components/Profile/MyProfile";
import Approvals from "./Components/Approvals/Approvals";
import Task from "./Components/Task/Task";
import MainHome from "./Components/Home/MainHome";
import { Avatar, IconButton, Modal } from "@mui/joy";
import axios from "axios";
import Reports from "./Components/Reports/Reports";
import Role from "./Components/Role/Role";
import Notification from "./Components/Notification/Notification";
import Archive from "./Components/ArchivedTasks/Archive";
import UnApprovedTask from "./Components/Task/UnApprovedTask";
import ChangePassword from "./Components/Profile/ChangePassword";
import PrivateRoute from "./Components/PrivateRoute"; // Import PrivateRoute
import { UserContext } from "./global/UserContext";
import io from "socket.io-client";
import SubTask from "./Components/SubTask/SubTask";

const socket = io(process.env.REACT_APP_API_URL);

function AppRoutes() {
  const { userData, login, logout } = useContext(UserContext);
  //   const userDataString = localStorage.getItem('userData');
  const [currentRouteName, setCurrentRouteName] = useState("");
  const [role, setRole] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [opennoti, setOpennoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const handleClose = () => setOpennoti(false);
  //   const [userData, setUserData] = useState({});
  const [userid, setuserid] = useState(userData?.userId || "");
  const [profilePic, setProfilePic] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/notifications"
      );
      const allNotifications = response.data
        .filter((notification) => notification.userId === userid)
        .reverse();
      setAllNotifications(allNotifications);
      setNewNotifications(
        allNotifications.filter(
          (notification) => notification.status === "unread"
        ).length
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // socket.on('newTask', (data)=>{
    socket.on("update_notification", (data) => {
      console.log("asdjfasjflaskjfaldskjfdsalkfjs");
      fetchNotifications();
    });

    socket.off("update_notification");
  }, []);
  useEffect(() => {
    fetchNotifications();
  }, [userid]);

  const handleOpen = () => setOpennoti(true);
  const markAllNotificationsAsRead = async () => {
    try {
      const notificationIds = allNotifications.map(
        (notification) => notification._id
      );
      await axios.put(
        process.env.REACT_APP_API_URL + "/api/notifications/mark-read",
        {
          notificationIds,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      setuserid(userDataObj.userId);
      //   fetchUserData(userDataObj.userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/user/${userId}`
      );
      const userData = response.data;
      //   setUserData(userData);
      setProfilePic(userData.profilePic);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleRouteChange = () => {
    const routeName = location.pathname.split("/").pop().replace(/-/g, " ");
    setCurrentRouteName(routeName.charAt(0).toUpperCase() + routeName.slice(1));
  };

  useEffect(() => {
    handleRouteChange();
  }, [location.pathname]);

  const getRole = (role) => {
    switch (role) {
      case 1:
        return "Dept Head";
      case 2:
        return "Project Head";
      case 3:
        return "Member";
      case 0:
        return "Super Admin";
      default:
        return "No Role";
    }
  };
  useEffect(() => {
    setRole(getRole(Number(userData?.userRole)));
  }, [userData]);

  return (
    <div className="lexend-bold">
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box
            component="main"
            className="MainContent m-1"
            sx={{
              px: { xs: 1 },
              overflow: "auto",
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 1,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              gap: 1,
              p: 1,
            }}
          >
            <div className="grid col  border lg:rounded-lg rounded-[3px] p-2 mt-2 lg:mt-0 gap-3">
              <div className="flex lg:flex-row items-center lg:items-end justify-between ">
                <div>
                  <Header />
                </div>
                <div
                  className="cursor-pointer gap-2 px-2 rounded-lg flex items-center "
                  style={{}}
                >
                  <div
                    className="cursor-pointer border gap-2 px-2 rounded-lg shadow-sm bg-gray-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div onClick={() => navigate("/profile")}>
                      <Avatar
                        variant="outlined"
                        size="md"
                        src={
                          userData?.profilePic ||
                          "https://via.placeholder.com/150"
                        }
                      />
                    </div>
                    <div
                      className="py-0.5"
                      onClick={() => navigate("/profile")}
                    >
                      <div sx={{ minWidth: 0, color: "" }}>
                        <h3 className="text-[17px]  capitalize font-bold">
                          {userData?.name}
                        </h3>
                        <div className="flex">
                          <h5 className="bg-gray-500 text-white text-xs font-medium me-2 px-2 text-center  rounded  border border-gray-500">
                            {role}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="cursor-pointer border gap-2 p-1 py-1.5 rounded-lg shadow-sm bg-gray-100 relative">
                      <IconButton
                        size="sm"
                        variant="plain"
                        className="p-2"
                        color="neutral"
                        onClick={handleOpen}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="black"
                          className="bi bi-bell-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                        </svg>
                        {/* Show badge only if there are new notifications */}
                        {newNotifications > 0 && (
                          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                            <span>{newNotifications}</span>
                          </div>
                        )}
                      </IconButton>
                      <Modal open={opennoti} onClose={handleClose}>
                        <Notification handleClose={handleClose} />
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Box></Box>
            <div>
              <Routes onChange={handleRouteChange}>
                <Route
                  path="/profile"
                  element={<PrivateRoute element={<MyProfile />} />}
                />
                <Route
                  path="/settings"
                  element={<PrivateRoute element={<ChangePassword />} />}
                />
                <Route
                  path="/home"
                  element={<PrivateRoute element={<MainHome />} />}
                />
                <Route
                  path="/*"
                  element={<PrivateRoute element={<MainHome />} />}
                />
                <Route
                  path="/approvals"
                  element={<PrivateRoute element={<Approvals />} />}
                />
                <Route
                  path="/task"
                  element={<PrivateRoute element={<Task />} />}
                />
                <Route
                  path="/sub-tasks"
                  element={<PrivateRoute element={<SubTask />} />}
                />
                <Route
                  path="/reports"
                  element={<PrivateRoute element={<Reports />} />}
                />
                <Route
                  path="/roles"
                  element={<PrivateRoute element={<Role />} />}
                />
                <Route
                  path="/archive-task"
                  element={<PrivateRoute element={<Archive />} />}
                />
                <Route
                  path="/unapproved-task"
                  element={<PrivateRoute element={<UnApprovedTask />} />}
                />
              </Routes>
            </div>
          </Box>
        </Box>
      </CssVarsProvider>
    </div>
  );
}

export default AppRoutes;

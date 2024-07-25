import React, { useContext, useEffect, useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
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
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications"
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
    fetchNotifications();
  }, [userid]);

  const handleOpen = () => setOpennoti(true);
  const markAllNotificationsAsRead = async () => {
    try {
      const notificationIds = allNotifications.map(
        (notification) => notification._id
      );
      await axios.put("http://localhost:5000/api/notifications/mark-read", {
        notificationIds,
      });
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
        `http://localhost:5000/api/user/${userId}`
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
    <div>
      <CssVarsProvider disableTransitionOnChange>
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 1, md: 6 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            }}
          >
            <div className="grid col border rounded-lg p-2 gap-3">
              <div className="flex lg:flex-row items-center lg:items-end justify-end">
                <div
                  className="cursor-pointer gap-2 px-2 rounded-lg"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
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
                        size="sm"
                        src={
                          userData?.profilePic ||
                          "https://via.placeholder.com/150"
                        }
                      />
                    </div>
                    <div onClick={() => navigate("/profile")}>
                      <div className="py-1" sx={{ minWidth: 0, color: "" }}>
                        <h3 className="text-xs capitalize font-bold">
                          {userData?.name}
                        </h3>
                        <h5 className="bg-gray-500 text-white text-xs font-medium me-2 px-2.5 rounded  border border-gray-500">
                          {role}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="cursor-pointer border gap-2 p-0.5 rounded-lg shadow-sm bg-gray-100">
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
                        <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
                          {newNotifications > 0 && (
                            <span
                              className="bg-red-500 text-white rounded-full "
                            >
                              {newNotifications}
                            </span>
                          )}
                        </div>
                      </IconButton>
                      <Modal open={opennoti} onClose={handleClose}>
                        <Notification handleClose={handleClose} />
                      </Modal>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Box
              sx={{
                display: "flex",
                mb: 1,
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "start", sm: "center" },
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              <Box className='hidden lg:block' sx={{ display: "flex", alignItems: "center" }}>
                <Breadcrumbs
                  size="sm"
                  aria-label="breadcrumbs"
                  separator={<ChevronRightRoundedIcon fontSize="sm" />}
                  sx={{ pl: 0 }}
                >
                  <Link
                    underline="none"
                    color="neutral"
                    href="/"
                    aria-label="Home"
                    fontSize={17}
                  >
                    <HomeRoundedIcon />
                  </Link>
                  <Typography color="primary" fontWeight={500} fontSize={17}>
                    {currentRouteName}
                  </Typography>
                </Breadcrumbs>
              </Box>
              {/* <Typography level="h2" component="h1" fontSize={20}>
                {currentRouteName}
              </Typography> */}
            </Box>
            <div style={{ height: "1000px", overflow: "auto" }}>
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

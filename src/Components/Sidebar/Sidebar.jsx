import React, { useContext, useEffect, useState } from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { closeSidebar } from "./utils";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../../global/UserContext";

function Toggler({ defaultExpanded = false, renderToggle, children }) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar({ onSidebarItemClick }) {
  const { userData, setUserData } = useContext(UserContext);
  const [currentRouteName, setCurrentRouteName] = useState("");
  const location = useLocation();
  // const [userData, setUserData] = useState("")
  const navigate = useNavigate();
  const routeName = location.pathname.split("/").pop().replace(/-/g, " ");

  const [selectedItem, setSelectedItem] = useState(routeName);
  useEffect(() => {
    const routeName = location.pathname.split("/").pop().replace(/-/g, " ");
    setCurrentRouteName(routeName.charAt(0).toUpperCase() + routeName.slice(1));
  }, [location.pathname]);
  const [userid, setuserid] = useState(userData?.userId);
  const handleLogout = () => {
    setUserData({});
    toast.dismiss();
    toast.error("Logout Successfully");
    navigate("/login");
    // setInterval(() => {
    //     window.location.reload();
    // }, 1000);
  };
  // useEffect(() => {
  //     // Retrieve userData from localStorage
  //     const userDataString = localStorage.getItem('userData');
  //     if (userDataString) {
  //         const userDataObj = JSON.parse(userDataString);
  //         const userId = userDataObj.userId;
  //         setuserid(userId);
  //     }
  // }, []);

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/userData"
      );
      // setUserData(Array.isArray(response.data) ? response.data : []);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching Group Data: ", error);
    }
  };

  useEffect(() => {
    // fetchUserData();
  }, []);

  // Find the current user based on the frontendUserId
  // const currentUser = Array.isArray(userData) && userData.find(user => user.userId === userid);

  // Check if the current user has userRole 0, 1, or 2
  // const showButton = userData?.userRole && (userData?.userRole === 0 || userData?.userRole === 1);
  const showButton = [0, 1].includes(userData?.userRole);

  return (
    <Sheet
      className="Sidebar z-10 lg:z-0 lexend-bold"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        // zIndex: 10,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography className="text-2xl  " style={{ fontWeight: "bold" }}>
          Promise Tracker
        </Typography>
      </Box>
      {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            marginTop: 2,
          }}
        >
          <ListItem
            nested
            onClick={() => {
              navigate("/home");
              handleItemClick("home");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "home"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-house"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                  </svg>
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Home
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
          <ListItem
            nested
            onClick={() => {
              navigate("/task");
              handleItemClick("task");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "task"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-list-task"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"
                    />
                    <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"
                    />
                  </svg>
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Task
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
       

          <ListItem
            nested
            onClick={() => {
              navigate("/reports");
              handleItemClick("reports");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "reports"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqklEQVR4nO2YwUoDMRCG//bSix4VfQBP4jPo0dYH8D161Hfw5kN4EN/FLfRuPVsvghRkJDALg+52s5tkkpb5IXRpk5n5mskkG8C0W6KEbQngdB9ASBOGuKWyqwZDiUEq8XmcwM8/h6nsHgF41ZgZSgwCLRhSAFGBISWQ5DCkCOKUDEYbJBlMDpAkMLlAosNo7Oy+rYrhMLaGns2KA1GPgwwkrshmhGWpFVlkqZUhtW4AvANYAZjmnJFtgfjIjav9vQXE0ag+BrYF0qURgHUJIO7iYCP6fwGY9PBz/wfiemAcrfIx4CAW3M/B/PDzE4Cxh48Zj3FtFhBH8HtDJY7aJwDOAXzwd48d9s9ESt0FxBH1Tc5B1LoE8M2/zVvGH4g/4YXXiSpIXZ3qNbFouVy7FSnjnqVc0M9i/OGAOHqpyYCsTpuOG8I593Ozc9WwuNecXkPiiAriU2YfuO8ngAvPxa0CMmWYpjLZpDFXMBIVjXhWQuLIckSZ8N5CIqVGu3rWWgXs/FQSSN+ULBYkaxxkIHFFNiMsS63IIkstlqVWqalFhbTB2hsQE5T1CwsPr7cDvXGAAAAAAElFTkSuQmCC"
                    style={{ width: "22px" }}
                  />{" "}
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Reports
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
          {showButton && (
            <ListItem
              nested
              onClick={() => {
                navigate("/roles");
                handleItemClick("roles");
              }}
            >
              <Toggler
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton
                    selected={selectedItem === "roles"}
                    className="p-2 px-3"
                    onClick={() => setOpen(!open)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      class="bi bi-person-fill-gear"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                    </svg>
                    <ListItemContent>
                      <Typography
                        className="lexend-bold"
                        style={{ fontSize: "17px", fontWeight: "bold" }}
                      >
                        Members
                      </Typography>
                    </ListItemContent>
                  </ListItemButton>
                )}
              ></Toggler>
            </ListItem>
          )}
          <ListItem
            nested
            onClick={() => {
              navigate("/approvals");
              handleItemClick("approvals");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "approvals"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-list-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"
                    />
                  </svg>
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Approvals
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
          <ListItem
            nested
            onClick={() => {
              navigate("/sub-tasks");
              handleItemClick("sub-tasks");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "sub-tasks"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="16"
                      y="9"
                      width="4"
                      height="4"
                      rx="2"
                      transform="rotate(90 16 9)"
                      stroke="#222222"
                    />
                    <rect
                      x="20"
                      y="17"
                      width="4"
                      height="4"
                      rx="2"
                      transform="rotate(90 20 17)"
                      stroke="#222222"
                    />
                    <path
                      d="M5 4V15C5 16.8856 5 17.8284 5.58579 18.4142C6.17157 19 7.11438 19 9 19H16"
                      stroke="#222222"
                    />
                    <path
                      d="M5 7V7C5 8.88562 5 9.82843 5.58579 10.4142C6.17157 11 7.11438 11 9 11H12"
                      stroke="#222222"
                    />
                  </svg>
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Sub Tasks
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
          <ListItem
            nested
            onClick={() => {
              navigate("/archive-task");
              handleItemClick("archive-task");
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton
                  selected={selectedItem === "archive-task"}
                  className="p-2 px-3"
                  onClick={() => setOpen(!open)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class="bi bi-archive"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                  </svg>
                  <ListItemContent>
                    <Typography
                      className="lexend-bold"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      Archive Tasks
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
              )}
            ></Toggler>
          </ListItem>
        </List>
      </Box>

      <div className="">
        <ListItem
          nested
          onClick={() => {
            navigate("/profile");
            handleItemClick("profile");
          }}
        >
          <Toggler
            renderToggle={({ open, setOpen }) => (
              <ListItemButton
                selected={selectedItem === "profile"}
                className="flex p-2 px-4 rounded-md bg-gray-100  items-center "
                onClick={() => setOpen(!open)}
              >
                <ListItemContent>
                  <Typography
                    className="lexend-bold"
                    style={{ fontSize: "20px", fontWeight: "bold" }}
                  >
                    Profile
                  </Typography>
                </ListItemContent>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  fill="currentColor"
                  class="bi bi-person"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              </ListItemButton>
            )}
          ></Toggler>
        </ListItem>
      </div>
      {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}> */}

      <ListItemButton
        selected={selectedItem === "Logout"}
        className="flex p-2 px-4 rounded-md bg-blue-100  items-center "
        onClick={handleLogout}
      >
        <ListItemContent>
          <Typography
            className="lexend-bold"
            style={{ fontSize: "20px", fontWeight: "bold" }}
          >
            Logout
          </Typography>
        </ListItemContent>
        <LogoutRoundedIcon style={{ fontSize: "20px" }} />
      </ListItemButton>
      {/* <IconButton onClick={handleLogout} className='flex p-2 px-5 gap-3 items-center ' variant="plain" color="neutral">
                    <Typography style={{ fontSize: "20px" }}>Logout</Typography>
                </IconButton> */}
      {/* </Box> */}
    </Sheet>
  );
}

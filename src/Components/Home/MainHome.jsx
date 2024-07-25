import {
  AspectRatio,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dropdown,
  IconButton,
  LinearProgress,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Skeleton,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import AddTask from "../Task/AddTask";
import Add from "@mui/icons-material/Add";
import CreateGroups from "../Group/CreateGroups";
import EditGroup from "../Group/EditGroup";
import { toast } from "react-toastify";

const DateComponent = ({ taskData }) => {
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const formatISODate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const startDate = new Date(taskData?.startDate);
  const endDate = new Date(taskData?.endDate);

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);

  const isStartDateValid = isValidDate(startDate);
  const isEndDateValid = isValidDate(endDate);

  const formattedDefaultDate =
    isStartDateValid && isEndDateValid
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const formatDatee = (dateString) => {
    if (!dateString) return ""; // If no date, return empty string
    try {
      if (dateString.includes("/")) {
        const [day, month] = dateString.split("/");
        return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}`;
      } else {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.error("Invalid date string:", dateString);
          return "Invalid Date";
        }
        const day = date.getDate();
        const month = date.getMonth();
        return `${monthNames[month]} ${day}`;
      }
    } catch (error) {
      console.error("Error while formatting date:", error);
      return "Invalid Date";
    }
  };

  const formatStartDate = formatDatee(taskData?.startDate);
  const formatEndDate = formatDatee(taskData?.endDate);

  console.log("Formatted Start Date:", formatStartDate);
  console.log("Formatted End Date:", formatEndDate);

  return (
    <div className="flex font-semibold rounded-[2px] mt-1 shadow  text-xs px-1 bg-yellow-400 ">
      <p>
        {formatStartDate} - {formatEndDate}
      </p>
    </div>
  );
};

function MainHome() {
  const [open, setOpen] = useState(false);
  const [EditModal, setEditModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const progressWidth = isSmallScreen ? "12px" : "24px";
  const progressSize = isSmallScreen ? "120px" : "180px";
  const [taskData, setTaskData] = useState("");
  const [userid, setuserid] = useState("");
  const [userId, setuserId] = useState("");
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState("");
  const [pinnedGroup, setPinnedGroup] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
  const [selectedGroup, setSelectedGroup] = useState(null); // State to store selected group data
  const [editedgroup, setEditedgroup] = useState(null); // State to store selected group data

  const calculateCompletionPercentage = () => {
    if (taskData.length === 0) return 0;

    const completedTasks = taskData.filter(
      (task) => task.status === "Completed"
    );
    const completionPercentage =
      (completedTasks.length / taskData.length) * 100;

    return completionPercentage;
  };

  // Function to get the appropriate message based on the completion percentage
  const getCompletionMessage = (percentage) => {
    if (percentage === 100) return "All tasks done! Great job!";
    if (percentage >= 76) return "Almost there! Just a few more tasks.";
    if (percentage >= 51) return "Over halfway! Keep going!";
    if (percentage >= 26) return "Good progress! Keep it up.";
    if (percentage >= 11) return "Nice start! You're getting there.";
    return "Let's get started!";
  };

  const completionPercentage = calculateCompletionPercentage();
  const completionMessage = getCompletionMessage(completionPercentage);

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGroup(null); // Reset selected group data when modal is closed
  };

  // Function to handle opening the modal and setting selected group data
  const handleGroupClick = (task) => {
    setSelectedGroup(task);
    setOpenModal(true);
  };
  const handleEditGroup = (task) => {
    setEditedgroup(task);
    setEditModal(true);
  };
  const HandleGroupCreate = (task) => {
    setSelectedGroup(task);
    setOpenModal(true);
  };
  useEffect(() => {
    // Retrieve userData from localStorage
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setuserid(userId);
      setuserId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks");
        const filteredTasks = response.data.filter((task) => {
          // Check if any of the people in the task match the user's ID
          return task.people.some((person) => person.userId === userid);
        });
        // const filteredTasks = response.data.filter(task => task.people.id === userid);
        setTaskData(filteredTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userid) {
      fetchData();
    }
  }, [userid]);

  useEffect(() => {
    const fetchpinnedGroup = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups`);

        // Filter groups based on userId match in pinnedBy array
        const filteredGroups = response.data.filter((group) => {
          // Check if userid exists in any pinnedBy userId
          return group.pinnedBy.some((pinned) => pinned.userId === userid);
        });

        // Update state with filtered groups
        setPinnedGroup(filteredGroups);
      } catch (error) {
        console.log("Error fetching Group Data: ", error);
      }
    };

    // Check if userid is truthy before calling fetchpinnedGroup
    if (userid) {
      fetchpinnedGroup();
    }
  }, [userid]); // useEffect dependency on userid
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups`);

        // Filter groups based on userId mismatch in pinnedBy array
        const filteredGroups = response.data.filter((group) => {
          // Check if userid does not exist in any pinnedBy userId
          return group.pinnedBy.every((pinned) => pinned.userId !== userid);
        });

        // Update state with filtered groups
        setGroupData(filteredGroups);
      } catch (error) {
        console.log("Error fetching Group Data: ", error);
      }
    };

    // Check if userid is truthy before calling fetchGroupData
    if (userid) {
      fetchGroupData();
    }
  }, [userid]);

  // Log pinnedGroup to check its value
  console.log("pinnedGroup", pinnedGroup);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/userData");
      setUserData(Array.isArray(response.data) ? response.data : []);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching Group Data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Find the current user based on the frontendUserId
  const currentUser =
    Array.isArray(userData) && userData.find((user) => user.userId === userid);

  // Check if the current user has userRole 0, 1, or 2
  const showButton =
    currentUser &&
    (currentUser.userRole === 0 ||
      currentUser.userRole === 1 ||
      currentUser.userRole === 2);
  const dpthead = currentUser && currentUser.userRole === 0;
  const prjtlead =
    currentUser && (currentUser.userRole === 0 || currentUser.userRole === 1);

  const spacing = 1;

  const color1 = "#EF7F1A4D";
  const color2 = "#0A91D04D";

  // Define the randomColor object as a function
  const randomColor = {
    // marginRight: spacing + "em",
    get backgroundColor() {
      const randomNumber = Math.random();
      return randomNumber < 0.5 ? color1 : color2;
    },
  };

  const handleTaskView = (groupId, groupName) => {
    // Navigate to the /task route with the group ID and group name as parameters
    navigate(`/task?groupId=${groupId}&groupName=${groupName}`);
  };

  const handlePinClick = async (_id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/pin/${_id}`,
        { userId }
      );
      if (response.status === 200) {
        console.log("Group pinned successfully:", response.data.group);
        toast.success("Group pinned successfully:");
        setInterval(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(response.data.message || "Failed to pin group.");
        console.error(
          "Error pinning group:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error pinning group:", error);
      toast.error("Error pinning group ");
    }
  };
  const handleunPinClick = async (_id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/unpin/${_id}/${userId}`
      );
      if (response.status === 200) {
        console.log("Group Unpinned successfully:", response.data.group);
        toast.success("Group Unpinned successfully:");
        setInterval(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(response.data.message || "Failed to pin group.");
        console.error(
          "Error Unpinning group:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error unpinning group:", error);
      toast.error("Error unpinning group ");
    }
  };
  //   const calculateDueMessage = (endDate) => {
  //     if (!endDate) return '';
  //     const end = new Date(endDate);
  //     const today = new Date();
  //     const differenceInTime = end.getTime() - today.getTime(); // Calculate the difference in milliseconds
  //     const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  //     // console.log('Difference in days:', differenceInDays);
  //     if (differenceInDays < 0) {
  //         // console.log('Overdue');
  //         return 'Overdue';
  //     } else if (differenceInDays === 0) {
  //         // console.log('Due today');
  //         return 'Due today';
  //     } else if (differenceInDays === 1) {
  //         // console.log('Due tomorrow');
  //         return 'Due tomorrow';
  //     } else if (differenceInDays === 2) {
  //         // console.log('Due in 2 days');
  //         return 'Due in 2 days';
  //     } else {
  //         // console.log('No due message');
  //         return '';
  //     }
  // };

  //   const formatDate2 = (dateString) => {
  //     if (!dateString) return ''; // Return empty string if no date string provided
  //     const date = new Date(dateString);
  //     if (isNaN(date.getTime())) {
  //         console.error('Invalid date:', dateString);
  //         return ''; // Return empty string if the date string is invalid
  //     }
  //     return date.toISOString().split('T')[0]; // Extracts the date part and returns in "YYYY-MM-DD" format
  // };
  //   const endDateFormatted = formatDate2(taskData?.endDate);
  //   const dueMessage = calculateDueMessage(endDateFormatted);

  const progressColor = "warning";
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <div>
      <div className="flex flex-col w-full rounded-lg">
        <main className="flex-1 p-2 md:p-4 grid gap-4 md:gap-4">
          <div className=" gap-4 md:gap-4">
            <div
              className="rounded-lg border bg-card    shadow-sm"
              style={{ background: "#0A91D0" }}
            >
              <div className="flex gap-9 items-center justify-between lg:justify-center p-8">
                <div>
                  <div className="flex items-center justify-center">
                    <h3 className="text-2xl lg:text-5xl font-semibold text-white text-center lg:text-start">
                      {completionMessage}
                    </h3>
                  </div>
                  <div className="flex items-center lg:m-3 justify-center">
                    <button
                      onClick={() => navigate("/task")}
                      className="mt-5 w-full lg:w-[50%] h-full lg:h-14 text-black lg:text-lg rounded-md text-sm font-medium px-2 py-2"
                      style={{ background: "#EA791D" }}
                    >
                      View tasks
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center p-3">
                  <CircularProgress
                    thickness={isSmallScreen ? 10 : 24}
                    className="bg-gray-700 "
                    color={progressColor}
                    size="lg"
                    sx={{
                      color: "",
                      "--CircularProgress-size": progressSize,
                      "--LinearProgress-thickness": progressWidth,
                    }}
                    determinate
                    value={completionPercentage.toFixed(2)}
                  >
                    <Typography className="text-white text-lg">
                      {completionPercentage.toFixed(2)}%
                    </Typography>
                  </CircularProgress>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-black font-semibold mb-2">
              In Progress
            </h2>
            <main className="flex flex-col gap-6 bg-gray-100 py-3 rounded-lg  justify-center mt-4 mb-4">
              <div className="">
                {loading ? (
                  <div className="flex justify-center items-center  w-full">
                    <span className="loader"></span>
                  </div>
                ) : (
                  Array.isArray(taskData) && (
                    <div className="flex flex-wrap gap-3 px-3   ">
                      {taskData
                        .filter((task) => task.status === "In Progress")
                        .map((task) => (
                          <div
                            onClick={() => navigate("/task")}
                            key={task?.id}
                            className="cursor-pointer lg:w-[300px] w-full mb-3 bg-blue-50 bg-card text-card-foreground shadow hover:shadow-md transition-all   rounded-lg"
                            style={randomColor}
                          >
                            <div className="p-3" data-v0-t="card">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-lg">
                                  {truncateText(task?.taskName, 20)}
                                </div>
                                <div
                                  className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs"
                                  data-v0-t="badge"
                                ></div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                  <div className="text-xs font-medium">
                                    Date
                                  </div>
                                  <div className="text-lg  ">
                                    <DateComponent taskData={task} />
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-xs font-medium">
                                    Group
                                  </div>
                                  <div className="text-xs mt-1.5">
                                    {task?.taskGroup.groupName}
                                  </div>
                                </div>
                                {/* <div>
              <div className="text-xs font-medium">Status</div>
              <div className="text-sm flex">
                <div className="text-sm border px-2 rounded bg-gray-100">
                  {task?.status}
                </div>
              </div>
            </div> */}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )
                )}
              </div>
            </main>
          </div>
          <div className="grid ">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-black font-semibold">Task Groups</h2>
              <div className="ml-auto">
                {showButton && (
                  <Button
                    variant="outlined"
                    color="neutral"
                    className="text-lg text-black"
                    startDecorator={<Add className="text-black" />}
                    onClick={() => setOpen(true)}
                  >
                    Add Groups
                  </Button>
                )}
              </div>
              <Modal
                className="mt-14"
                open={open}
                onClose={() => setOpen(false)}
              >
                <ModalDialog
                  className=" px-5 max-w-md rounded-lg bg-white shadow-lg "
                  minWidth={500}
                  style={{ height: "580px", overflow: "auto" }}
                >
                  <div onSubmit={() => setOpen(false)}>
                    <ModalClose />

                    <CreateGroups />
                  </div>
                </ModalDialog>
              </Modal>
            </div>
            <div className="   mt-4 rounded-lg ">
              <div style={{ minWidth: "100%", display: "table" }}>
                <div className=" space-y-4">
                  <div class="flex flex-col space-y-1.5 bg-gray-100 px-4 pb-4 pt-1 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-lg font-medium">Pinned Group</div>
                      <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="h-5 w-5"
                        >
                          <line x1="12" x2="12" y1="17" y2="22"></line>
                          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                        </svg>
                        <span class="sr-only">Unpin</span>
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-3 justify-center lg:justify-start  w-full">
                      {Array.isArray(pinnedGroup) &&
                        pinnedGroup.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center "
                          >
                            <div class="">
                              <div
                                class="rounded-lg lg:w-[300px]  w-[320px]  border bg-card bg-[#0A91D04D] text-card-foreground shadow-sm"
                                data-v0-t="card"
                              >
                                <div class="px-2 py-2 flex flex-col gap-4">
                                  <div class=" flex items-center justify-between  gap-3 ">
                                    <div class=" flex items-center  gap-3 ">
                                      <Avatar
                                        className="flex items-center justify-center  rounded-full border text-black bg-gray-200 "
                                        src={task?.profilePic}
                                        size="sm"
                                      />
                                      <div class="font-medium">
                                        {truncateText(task?.groupName, 13)}
                                      </div>
                                    </div>
                                    <div>
                                      <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          stroke-width="2"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          class="h-5 w-5"
                                        >
                                          <line
                                            x1="12"
                                            x2="12"
                                            y1="17"
                                            y2="22"
                                          ></line>
                                          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                        </svg>
                                        <span class="sr-only">Unpin</span>
                                      </button>
                                      <Dropdown>
                                        <MenuButton
                                          className="rounded-full p-0.5 px-2.5 bg-white text-gray-600  font-bold"
                                          slotProps={{
                                            root: {
                                              variant: "outlined",
                                              color: "neutral",
                                            },
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            fill="currentColor"
                                            class="bi bi-three-dots"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                          </svg>
                                        </MenuButton>
                                        <Menu className="varela-round-regular">
                                          <MenuItem
                                            onClick={() =>
                                              handleunPinClick(task._id)
                                            }
                                          >
                                            UNPIN GROUP
                                          </MenuItem>
                                          {showButton && (
                                            <MenuItem
                                              onClick={() =>
                                                handleEditGroup(task)
                                              }
                                            >
                                              EDIT GROUP
                                            </MenuItem>
                                          )}
                                          {/* <MenuItem
                                        onClick={() =>
                                          handleClickDelete(task?._id)
                                        }
                                        >
                                          Delete Group
                                        </MenuItem> */}
                                          {/* 

                                                <Modal className="mt-14" open={deletemodal} onClose={() => setDeletemodal(false)}>
                                                    <ModalDialog className="" minWidth={300} style={{ height: "200px" }}>
                                                        <ModalClose />
                                                        <div>
                                                            <div className='p-3 mt-2'>
                                                                <h1 className='text-lg font-bold w-[400px] '>You are about to delete a group which has active and unapproved tasks. Are you sure you want to delete all data?</h1>
                                                                <div className="flex justify-between gap-2 mt-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDeletemodal(false)}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:bg-yellow-200 h-10 px-4 py-2"
                                                                    >
                                                                        No, keep my data
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(groupIdToDelete)}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-800 h-10 px-4 py-2"
                                                                    >
                                                                        Yes, delete group
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ModalDialog>
                                                </Modal> */}
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                  <div class="text-sm text-muted-foreground flex lg:justify-end   justify-between    gap-3 items-center ">
                                    <button
                                      onClick={() =>
                                        handleTaskView(task._id, task.groupName)
                                      }
                                      class="inline-flex bg-white hover:bg-gray-300  items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Task
                                    </button>

                                    <button
                                      onClick={() => handleGroupClick(task)}
                                      class="inline-flex bg-white hover:bg-gray-300   items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Group
                                    </button>
                                    <Modal
                                      open={openModal}
                                      onClose={handleCloseModal}
                                    >
                                      <ModalDialog
                                        className="bg-gray-200 mt-10"
                                        maxWidth={500}
                                        minWidth={700}
                                        style={{ overflow: "auto" }}
                                      >
                                        <ModalClose />
                                        <form onSubmit={handleCloseModal}>
                                          {selectedGroup && (
                                            <div>
                                              <main className="w-full max-w-5xl mx-auto px-4 py-6 border">
                                                <div className="grid gap-6 md:gap-6 lg:gap-8">
                                                  <div className="grid gap-2">
                                                    <div className="flex gap-5 items-end">
                                                      <Avatar
                                                        className="flex items-center justify-center rounded-full border text-black bg-gray-100"
                                                        src={
                                                          selectedGroup?.profilePic
                                                        }
                                                      />
                                                      <h1 className="text-4xl font-bold">
                                                        {
                                                          selectedGroup?.groupName
                                                        }
                                                      </h1>
                                                      <div className="flex items-center gap-4 text-gray-600 text-bold">
                                                        {/* <span>{createdAt ? formatDate(createdAt) : ''}</span> */}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Department Head
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <span>
                                                        {selectedGroup?.deptHead
                                                          ?.length ? (
                                                          selectedGroup.deptHead.map(
                                                            (person, index) =>
                                                              person ? (
                                                                <span
                                                                  key={index}
                                                                  className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                    index %
                                                                      2 ===
                                                                    0
                                                                      ? "bg-yellow-500 text-white"
                                                                      : "bg-purple-500 text-white"
                                                                  }`}
                                                                >
                                                                  {person.name}
                                                                </span>
                                                              ) : null
                                                          )
                                                        ) : (
                                                          <span>
                                                            No department heads
                                                            available.
                                                          </span>
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Members
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <div className="text-white py-1 rounded-full text-sm font-medium">
                                                        {selectedGroup?.members?.map(
                                                          (person, index) => (
                                                            <span
                                                              key={index}
                                                              className={`inline-block px-2 py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                index % 2 === 0
                                                                  ? "bg-green-500 text-white"
                                                                  : "bg-blue-500 text-white"
                                                              }`}
                                                            >
                                                              {person.name}
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Project Lead
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <span>
                                                        {selectedGroup
                                                          ?.projectLead
                                                          ?.length ? (
                                                          selectedGroup.projectLead.map(
                                                            (person, index) =>
                                                              person ? (
                                                                <span
                                                                  key={index}
                                                                  className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                    index %
                                                                      2 ===
                                                                    0
                                                                      ? "bg-yellow-500 text-white"
                                                                      : "bg-purple-500 text-white"
                                                                  }`}
                                                                >
                                                                  {person.name}
                                                                </span>
                                                              ) : null
                                                          )
                                                        ) : (
                                                          <span>
                                                            No department heads
                                                            available.
                                                          </span>
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </main>
                                            </div>
                                          )}
                                        </form>
                                      </ModalDialog>
                                    </Modal>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}{" "}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5 bg-gray-100 px-4 pb-4 pt-1 rounded-lg">
                    <div className="flex itmes-start">
                      <div class="text-lg font-medium">Group</div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start  w-full  ">
                      {Array.isArray(groupData) &&
                        groupData.map((task, index) => (
                          <div
                            key={index}
                            className="flex  items-center justify-center "
                          >
                            <div class="">
                              <div class="rounded-lg lg:w-[300px] w-[320px]  border bg-card bg-[#EF7F1A4D]  shadow-sm">
                                <div class="px-2 py-3 flex flex-col gap-4">
                                  <div class=" flex items-center justify-between  gap-3 ">
                                    <div class=" flex items-center  gap-3 ">
                                      <Avatar
                                        className="flex items-center justify-center  rounded-full border text-black bg-gray-200 "
                                        src={task?.profilePic}
                                        size="sm"
                                      />
                                      <div class="font-medium">
                                        {truncateText(task?.groupName, 13)}
                                      </div>
                                    </div>
                                    <div>
                                      
                                      <Dropdown>
                                        <MenuButton
                                          className="rounded-full p-1 px-2.5 bg-white  text-gray-600  font-bold"
                                          slotProps={{
                                            root: {
                                              variant: "outlined",
                                              color: "neutral",
                                            },
                                          }}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            fill="currentColor"
                                            class="bi bi-three-dots"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                          </svg>
                                        </MenuButton>
                                        <Menu className="varela-round-regular">
                                          <MenuItem
                                            onClick={() =>
                                              handlePinClick(task._id)
                                            }
                                          >
                                            PIN GROUP
                                          </MenuItem>
                                          {showButton && (
                                            <MenuItem
                                              onClick={() =>
                                                handleEditGroup(task)
                                              }
                                            >
                                              EDIT GROUP
                                            </MenuItem>
                                          )}
                                          {/* <MenuItem
                                        onClick={() =>
                                          handleClickDelete(task?._id)
                                        }
                                        >
                                          Delete Group
                                        </MenuItem> */}
                                          {/* 

                                                <Modal className="mt-14" open={deletemodal} onClose={() => setDeletemodal(false)}>
                                                    <ModalDialog className="" minWidth={300} style={{ height: "200px" }}>
                                                        <ModalClose />
                                                        <div>
                                                            <div className='p-3 mt-2'>
                                                                <h1 className='text-lg font-bold w-[400px] '>You are about to delete a group which has active and unapproved tasks. Are you sure you want to delete all data?</h1>
                                                                <div className="flex justify-between gap-2 mt-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDeletemodal(false)}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:bg-yellow-200 h-10 px-4 py-2"
                                                                    >
                                                                        No, keep my data
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(groupIdToDelete)}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-800 h-10 px-4 py-2"
                                                                    >
                                                                        Yes, delete group
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ModalDialog>
                                                </Modal> */}
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                  <div class="text-sm text-muted-foreground flex lg:justify-end   justify-center   gap-3 items-center ">
                                    <button
                                      onClick={() =>
                                        handleTaskView(task._id, task.groupName)
                                      }
                                      class="inline-flex bg-white hover:bg-gray-300  items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Task
                                    </button>

                                    <button
                                      onClick={() => handleGroupClick(task)}
                                      class="inline-flex bg-white hover:bg-gray-300  items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Group
                                    </button>
                                    <Modal
                                      className="mt-14"
                                      open={EditModal}
                                      onClose={() => setEditModal(false)}
                                    >
                                      <ModalDialog
                                        className=""
                                        minWidth={500}
                                        style={{
                                          height: "600px",
                                          overflow: "auto",
                                        }}
                                      >
                                        <ModalClose />
                                        <div
                                          onSubmit={() => setEditModal(false)}
                                        >
                                          {editedgroup && (
                                            <EditGroup
                                              dpthead={dpthead}
                                              prjtlead={prjtlead}
                                              Editid={editedgroup?._id}
                                            />
                                          )}
                                        </div>
                                      </ModalDialog>
                                    </Modal>
                                    <Modal
                                      open={openModal}
                                      onClose={handleCloseModal}
                                    >
                                      <ModalDialog
                                        className="bg-gray-200 mt-10"
                                        maxWidth={500}
                                        minWidth={700}
                                        style={{ overflow: "auto" }}
                                      >
                                        <ModalClose />
                                        <form onSubmit={handleCloseModal}>
                                          {selectedGroup && (
                                            <div>
                                              <main className="w-full max-w-5xl mx-auto px-4 py-6 border">
                                                <div className="grid gap-6 md:gap-6 lg:gap-8">
                                                  <div className="grid gap-2">
                                                    <div className="flex gap-5 items-end">
                                                      <Avatar
                                                        className="flex items-center justify-center rounded-full border text-black bg-gray-100"
                                                        src={
                                                          selectedGroup?.profilePic
                                                        }
                                                      />
                                                      <h1 className="text-4xl font-bold">
                                                        {
                                                          selectedGroup?.groupName
                                                        }
                                                      </h1>
                                                      <div className="flex items-center gap-4 text-gray-600 text-bold">
                                                        {/* <span>{createdAt ? formatDate(createdAt) : ''}</span> */}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Department Head
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <span>
                                                        {selectedGroup?.deptHead
                                                          ?.length ? (
                                                          selectedGroup.deptHead.map(
                                                            (person, index) =>
                                                              person ? (
                                                                <span
                                                                  key={index}
                                                                  className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                    index %
                                                                      2 ===
                                                                    0
                                                                      ? "bg-yellow-500 text-white"
                                                                      : "bg-purple-500 text-white"
                                                                  }`}
                                                                >
                                                                  {person.name}
                                                                </span>
                                                              ) : null
                                                          )
                                                        ) : (
                                                          <span>
                                                            No department heads
                                                            available.
                                                          </span>
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Members
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <div className="text-white py-1 rounded-full text-sm font-medium">
                                                        {selectedGroup?.members?.map(
                                                          (person, index) => (
                                                            <span
                                                              key={index}
                                                              className={`inline-block px-2 py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                index % 2 === 0
                                                                  ? "bg-green-500 text-white"
                                                                  : "bg-blue-500 text-white"
                                                              }`}
                                                            >
                                                              {person.name}
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <h2 className="text-2xl font-bold mb-4">
                                                      Project Lead
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                      <span>
                                                        {selectedGroup
                                                          ?.projectLead
                                                          ?.length ? (
                                                          selectedGroup.projectLead.map(
                                                            (person, index) =>
                                                              person ? (
                                                                <span
                                                                  key={index}
                                                                  className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${
                                                                    index %
                                                                      2 ===
                                                                    0
                                                                      ? "bg-yellow-500 text-white"
                                                                      : "bg-purple-500 text-white"
                                                                  }`}
                                                                >
                                                                  {person.name}
                                                                </span>
                                                              ) : null
                                                          )
                                                        ) : (
                                                          <span>
                                                            No department heads
                                                            available.
                                                          </span>
                                                        )}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </main>
                                            </div>
                                          )}
                                        </form>
                                      </ModalDialog>
                                    </Modal>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainHome;

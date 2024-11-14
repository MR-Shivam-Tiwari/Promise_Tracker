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
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddTask from "../Task/AddTask";
import Add from "@mui/icons-material/Add";
import CreateGroups from "../Group/CreateGroups";
import EditGroup from "../Group/EditGroup";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";

const DateComponent = ({ taskData }) => {
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const startDate = new Date(taskData?.startDate);
  const endDate = new Date(taskData?.endDate);

  const isStartDateValid = isValidDate(startDate);
  const isEndDateValid = isValidDate(endDate);

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

  return (
    <div className="flex font-semibold rounded-[2px] mt-1 shadow text-xs px-1 bg-yellow-300 ">
      <p>
        {formatStartDate} - {formatEndDate}
      </p>
    </div>
  );
};

function MainHome() {
  const { userData, setUserData } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [EditModal, setEditModal] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const progressWidth = isSmallScreen ? "12px" : "24px";
  const progressSize = isSmallScreen ? "120px" : "180px";
  const [userid, setuserid] = useState(userData?.userId);
  const [userId, setuserId] = useState(userData?.userId);
  const [loading, setLoading] = useState(false);
  const [grouploading, setgroupLoading] = useState(false);
  const [pingrouploading, setpingroupLoading] = useState(false);
  const [groupData, setGroupData] = useState("");
  const [pinnedGroup, setPinnedGroup] = useState([]);
  const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
  const [selectedGroup, setSelectedGroup] = useState(null); // State to store selected group data
  const [editedgroup, setEditedgroup] = useState(null); // State to store selected group data
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionMessage, setCompletionMessage] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iseditModalOpen, setIseditModalOpen] = useState(false);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      setIsModalOpen(false);
    }
  };
  const handleeditOutsideClick = (e) => {
    if (e && e.target && e.target.id === "modal-background") {
      setIseditModalOpen(false);
    }
  };

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage());
    setCompletionMessage(getCompletionMessage(completionPercentage));
  }, [taskData]);

  const calculateCompletionPercentage = () => {
    if (taskData.length === 0) return 0;
    const withoutArchive = taskData.filter(
      (task) =>
        task.status !== "Archive" &&
        task.people.some((person) => person.userId === userid)
    );
    const completedTasks = taskData.filter(
      (task) =>
        task.status === "Completed" &&
        task.people.some((person) => person.userId === userid)
    );
    const completionPercentage =
      (completedTasks.length / withoutArchive.length) * 100;
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGroup(null); // Reset selected group data when modal is closed
  };

  // Function to handle opening the modal and setting selected group data
  const handleGroupClick = (task) => {
    setSelectedGroup(task);
  };
  const handleEditGroup = (task) => {
    setEditedgroup(task);
    setEditModal(true);
  };
  const HandleGroupCreate = (task) => {
    setSelectedGroup(task);
    setOpenModal(true);
  };

  // useEffect(() => {
  //   // Retrieve userData from localStorage
  //   const userDataString = localStorage.getItem("userData");
  //   if (userDataString) {
  //     const userDataObj = JSON.parse(userDataString);
  //     const userId = userDataObj.userId;
  //     setuserid(userId);
  //     setuserId(userId);
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/api/tasks"
        );
        const filteredTasks = response.data.filter((task) => {
          return task.people.some((person) => person.userId === userid);
        });
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

  const fetchpinnedGroup = async () => {
    // setgroupLoading(true);
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/groups`
      );

      // Filter groups based on userId match in pinnedBy array
      const filteredGroups = response.data.filter((group) => {
        return group.pinnedBy.some((pinned) => pinned.userId === userid);
      });

      setPinnedGroup(filteredGroups);
    } catch (error) {
      console.log("Error fetching Group Data: ", error);
    } finally {
      setgroupLoading(false);
    }
  };
  useEffect(() => {
    if (userid) {
      fetchpinnedGroup();
    }
  }, [userid]);

  const fetchGroupData = async () => {
    // setpingroupLoading(true);
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/groups`
      );

      // Filter groups based on userId mismatch in pinnedBy array
      const filteredGroups = response.data.filter((group) => {
        return group.pinnedBy.every((pinned) => pinned.userId !== userid);
      });

      setGroupData(filteredGroups);
    } catch (error) {
      console.log("Error fetching Group Data: ", error);
    } finally {
      setpingroupLoading(false);
    }
  };
  useEffect(() => {
    if (userid) {
      fetchGroupData();
    }
  }, [userid]);

  // Find the current user based on the frontendUserId
  const currentUser = userData;
    // Array.isArray(userData) && userData.find((user) => user.userId === userid);

  // Check if the current user has userRole 0, 1, or 2
  const showButton =
    currentUser &&
    (currentUser.userRole === 0 ||
      currentUser.userRole === 1 ||
      currentUser.userRole === 2);
  const dpthead = currentUser && currentUser.userRole === 0;
  const prjtlead =
    currentUser && (currentUser.userRole === 0 || currentUser.userRole === 1);

  const color1 = "#EF7F1A4D";
  const color2 = "#0A91D04D";

  // Define the randomColor object as a function
  const randomColor = {
    get backgroundColor() {
      const randomNumber = Math.random();
      return randomNumber < 0.5 ? color1 : color2;
    },
  };

  const handleTaskView = (groupId, groupName) => {
    navigate(`/task?groupId=${groupId}&groupName=${groupName}`);
  };

  const handlePinClick = async (_id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/pin/${_id}`,
        { userId }
      );
      if (response.status === 200) {
        console.log("Group pinned successfully:", response.data.group);
        toast.dismiss();
        toast.success("Group pinned successfully:");
        fetchpinnedGroup();
        fetchGroupData();
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
        `${process.env.REACT_APP_API_URL}/api/unpin/${_id}/${userId}`
      );
      if (response.status === 200) {
        console.log("Group Unpinned successfully:", response.data.group);
        toast.dismiss();
        toast.success("Group Unpinned successfully:");
        fetchGroupData();
        fetchpinnedGroup();
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

  const progressColor = "warning";
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div>
      <div className="flex flex-col w-full lg:rounded-lg rounded-[3px]">
        <main className="flex-1  grid gap-4 md:gap-4">
          <div className=" gap-4 md:gap-4">
            <div
              className="lg:rounded-lg rounded-[3px] border bg-card    shadow-sm"
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
            <main className="flex flex-col gap-6 bg-gray-100 py-3 lg:rounded-lg rounded-[3px] justify-center mt-4 mb-4">
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
                            className="cursor-pointer lg:w-[300px] w-full mb-3 bg-blue-50 bg-card text-card-foreground shadow hover:shadow-md transition-all lg:rounded-lg rounded-[3px]"
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
                                  <div className="text-lg flex ">
                                    <DateComponent taskData={task} />
                                  </div>
                                </div>

                                <div className="">
                                  <div className="text-xs font-medium">
                                    Group
                                  </div>
                                  <div className="text-xs mt-1.5">
                                    {task?.taskGroup?.groupName}
                                  </div>
                                </div>
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
                  className=" px-5 max-w-md lg:rounded-lg rounded-[3px] bg-white shadow-lg "
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
            <div className="   mt-4 lg:rounded-lg rounded-[3px] ">
              <div style={{ minWidth: "100%", display: "table" }}>
                <div className=" space-y-4">
                  <div class="flex flex-col space-y-1.5 bg-gray-100 px-4 pb-4 pt-1 lg:rounded-lg rounded-[3px]">
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
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start w-full">
                      {grouploading ? (
                        <div className="flex justify-center items-center w-full">
                          <span className="loader"></span>
                        </div>
                      ) : (
                        Array.isArray(pinnedGroup) &&
                        pinnedGroup.map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center"
                          >
                            <div
                              className="lg:rounded-lg rounded-[3px] lg:w-[300px] w-[320px] border bg-card bg-[#0A91D04D] text-card-foreground shadow-sm"
                              data-v0-t="card"
                            >
                              <div className="px-2 py-2 flex flex-col gap-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <Avatar
                                      className="flex items-center justify-center rounded-full border text-black bg-gray-200"
                                      src={task?.profilePic}
                                      size="sm"
                                    />
                                    <div className="font-medium">
                                      {truncateText(task?.groupName, 13)}
                                    </div>
                                  </div>
                                  <div>
                                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5"
                                      >
                                        <line
                                          x1="12"
                                          x2="12"
                                          y1="17"
                                          y2="22"
                                        ></line>
                                        <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
                                      </svg>
                                      <span className="sr-only">Unpin</span>
                                    </button>
                                    <Dropdown>
                                      <MenuButton
                                        className="rounded-full px-[10px] bg-white text-gray-600 font-bold"
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
                                          className="bi bi-three-dots-vertical"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
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
                                        {/* {showButton && ( */}
                                        <MenuItem
                                          onClick={() => {
                                            handleEditGroup(task);
                                            setIseditModalOpen(true);
                                          }}
                                        >
                                          EDIT GROUP
                                        </MenuItem>
                                        {/* )} */}
                                      </Menu>
                                    </Dropdown>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground flex lg:justify-end justify-between gap-3 items-center">
                                  <button
                                    onClick={() =>
                                      handleTaskView(task._id, task?.groupName)
                                    }
                                    className="inline-flex bg-white hover:bg-gray-300 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                  >
                                    View Task
                                  </button>

                                  <button
                                    onClick={() => {
                                      handleGroupClick(task);
                                      setIsModalOpen(true);
                                    }}
                                    className="inline-flex bg-white hover:bg-gray-300 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                  >
                                    View Group
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5 bg-gray-100 px-4 pb-4 pt-1 lg:rounded-lg rounded-[3px]">
                    <div className="flex itmes-start">
                      <div class="text-lg font-medium">Group</div>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start  w-full  ">
                      {pingrouploading ? (
                        <div className="flex justify-center items-center w-full">
                          <span className="loader"></span>
                        </div>
                      ) : (
                        Array.isArray(groupData) &&
                        groupData.map((task, index) => (
                          <div
                            key={index}
                            className="flex  items-center justify-center "
                          >
                            <div class="">
                              <div class="lg:rounded-lg rounded-[3px] lg:w-[300px] w-[320px]  border bg-card bg-[#EF7F1A4D]  shadow-sm">
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
                                          className="rounded-full  px-[10px] bg-white  text-gray-600  font-bold"
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
                                            class="bi bi-three-dots-vertical"
                                            viewBox="0 0 16 16"
                                          >
                                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
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
                                          {/* {showButton && ( */}
                                          <MenuItem
                                            onClick={() => {
                                              handleEditGroup(task);
                                              setIseditModalOpen(true);
                                            }}
                                          >
                                            EDIT GROUP
                                          </MenuItem>
                                          {/* )} */}
                                        </Menu>
                                      </Dropdown>
                                    </div>
                                  </div>
                                  <div class="text-sm text-muted-foreground flex lg:justify-end justify-center gap-3 items-center ">
                                    <button
                                      onClick={() =>
                                        handleTaskView(task._id, task?.groupName)
                                      }
                                      class="inline-flex bg-white hover:bg-gray-300  items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Task
                                    </button>

                                    <button
                                      onClick={() => {
                                        handleGroupClick(task);
                                        setIsModalOpen(true);
                                      }}
                                      class="inline-flex bg-white hover:bg-gray-300  items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 rounded-[3px] px-3"
                                    >
                                      View Group
                                    </button>

                                 

                                    {isModalOpen && (
                                      <div
                                        id="modal-background"
                                        className="fixed inset-0 z-10 bg-opacity-20 bg-gray-700 flex justify-center items-center"
                                        onClick={handleOutsideClick}
                                      >
                                        <div className="bg-white p-3 lg:rounded-lg rounded-[3px]  relative">
                                          {selectedGroup && (
                                            <main className="w-[100%]  lg:w-[100vh] overflow-auto h-[70vh] ">
                                              <div class="bg-card p-1 ">
                                                <div class="flex justify-between items-center mb-4">
                                                  <h2 class="text-lg flex josefin-sans-bold items-center  gap-3 font-semibold">
                                                    <Avatar
                                                      className="flex items-center justify-center h-8 shadow-md  w-8 rounded-full border border-gray-400 text-black bg-gray-100"
                                                      src={
                                                        selectedGroup?.profilePic
                                                      }
                                                    />{" "}
                                                    {selectedGroup?.groupName}
                                                  </h2>
                                                  <button
                                                    onClick={() =>
                                                      setIsModalOpen(false)
                                                    }
                                                    class="text-muted-foreground hover:text-muted"
                                                  >
                                                    ✖️
                                                  </button>
                                                </div>
                                                <div class="bg-gray-300 p-4 min-h-[100px] varela-round-regular lg:rounded-lg rounded-[3px] mb-4">
                                                  <h3 class="font-semibold">
                                                    Department Head
                                                  </h3>
                                                  <div className="flex flex-wrap gap-2 ">
                                                    <span>
                                                      {selectedGroup?.deptHead
                                                        ?.length ? (
                                                        selectedGroup.deptHead.map(
                                                          (person, index) =>
                                                            person ? (
                                                              <span
                                                                key={index}
                                                                className="inline-block   py-1 rounded-full me-2 "
                                                              >
                                                                <li className="">
                                                                  <span className="border lexend-bold px-2 shadow  bg-gray-200 rounded ">
                                                                    {
                                                                      person.name
                                                                    }
                                                                  </span>
                                                                </li>
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

                                                <div class="bg-gray-300 p-4 mb-4 min-h-[100px]  varela-round-regular  lg:rounded-lg rounded-[3px]">
                                                  <h3 class="font-semibold">
                                                    Project Lead
                                                  </h3>
                                                  <span>
                                                    {selectedGroup?.projectLead
                                                      ?.length ? (
                                                      selectedGroup.projectLead.map(
                                                        (person, index) =>
                                                          person ? (
                                                            <span
                                                              key={index}
                                                              className="inline-block py-1 rounded-full mr-2 "
                                                            >
                                                              <li className="mb-1">
                                                                <span className="border px-2 lexend-bold  bg-blue-200 border-blue-200 shadow  rounded ">
                                                                  {person.name}
                                                                </span>
                                                              </li>
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
                                                <div class="bg-gray-300 p-4 min-h-[100px] varela-round-regular  lg:rounded-lg rounded-[3px]">
                                                  <h3 class="font-semibold">
                                                    Team Members
                                                  </h3>
                                                  <ul class="list-disc list-inside">
                                                    {selectedGroup?.members?.map(
                                                      (person, index) => (
                                                        <span
                                                          key={index}
                                                          className="   "
                                                        >
                                                          <li className="mb-1">
                                                            <span className="border px-2  lexend-bold bg-orange-200 border-orange-200 shadow  rounded ">
                                                              {person.name}
                                                            </span>
                                                          </li>
                                                        </span>
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                              </div>
                                            </main>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {iseditModalOpen && (
                                      <div
                                        id="modal-background"
                                        className="fixed inset-0 z-10 bg-opacity-20 bg-gray-700  flex justify-center items-center"
                                        onClick={handleeditOutsideClick}
                                      >
                                        <div></div>
                                        <div className="bg-white p-4 lg:rounded-lg rounded-[3px]  relative ">
                                          <div className="flex justify-end">
                                            <button
                                              onClick={() =>
                                                setIseditModalOpen(false)
                                              }
                                              class="text-muted-foreground hover:text-muted"
                                            >
                                              ✖️
                                            </button>
                                          </div>
                                          {editedgroup && (
                                            <EditGroup
                                              dpthead={dpthead}
                                              prjtlead={prjtlead}
                                              Editid={editedgroup?._id}
                                              fetchGroupData={fetchGroupData}
                                              setIseditModalOpen={
                                                setIseditModalOpen
                                              }
                                              fetchpinnedGroup={
                                                fetchpinnedGroup
                                              }
                                            />
                                          )}
                                        </div>
                                      </div>
                                    )}
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

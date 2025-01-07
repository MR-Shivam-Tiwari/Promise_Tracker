import {
  AspectRatio,
  Box,
  Button,
  Chip,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Modal,
  Sheet,
  Skeleton,
  Typography,
} from "@mui/joy";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalClose from "@mui/joy/ModalClose";
import ViewTask from "../ViewTask";
import EditTask from "../EditTask";
import Load from "./Loading.gif";
import axios from "axios";
import { UserContext } from "../../../global/UserContext";
import { CircularProgress } from "@mui/material";
const ItemTypes = {
  CARD: "card",
};
const Section = ({ title, cards, moveCard, loading, fetchTasks }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop(item, monitor) {
      moveCard(item.id, title);
    },
  });

  return (
    <div
      className="flex flex-col mt-5   lg:rounded-lg rounded-[3px] border h-[670px] w-full"
      ref={drop}
    >
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3 ">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="inline-flex w-fit items-center whitespace-nowrap border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground rounded-full px-3 py-1 text-sm">
          {cards.length}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 p-2 overflow-y-scroll">
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <div key={index} style={{ width: "100%" }}>
              <Box
                sx={{ m: "auto", display: "flex", justifyContent: "center" }}
              >
                <AspectRatio variant="plain" sx={{ width: 300 }}>
                  <Skeleton loading={loading}>
                    <img
                      src={
                        loading
                          ? "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                          : "https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2"
                      }
                      alt=""
                    />
                  </Skeleton>
                </AspectRatio>
              </Box>
            </div>
          ))
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              id={card._id}
              text={card.taskName}
              status={card.status}
              fetchTasks={fetchTasks}
            />
          ))
        ) : (
          <div className="border px-2 bg-gray-300 font-bold rounded-[3px]">
            No tasks available
          </div>
        )}
      </div>
    </div>
  );
};
const Card = ({ id, text, status, card, fetchTasks }) => {
  const { userData } = useContext(UserContext);
    const textareaRef = useRef(null);
    const inputRef = useRef(null);
    const userDataString = localStorage.getItem("userData");
    const [userid, setUserid] = useState(
      JSON.parse(userDataString)?.userId || ""
    );
  const [allTasks, setAllTasks] = useState([]);

  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [linkLoader, setLinkLoader] = useState(false);


  
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [fileLink, setFileLink] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentCard, setCurrentCard] = useState(null);
    const [viewselectedTask, setviewSelectedTask] = useState(null);
    const [proofText, setProofText] = useState("");
    const [proofFile, setProofFile] = useState(null);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    useEffect(() => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userDataObj = JSON.parse(userDataString);
        const userId = userDataObj.userId;
        setUserid(userId);
      }
    }, []);

     useEffect(() => {
        if (isCompleteModalOpen && textareaRef.current) {
          textareaRef.current.focus(); // Focus the textarea when the modal opens
        }
      }, [isCompleteModalOpen]);
          const checkEdit = () => {
            axios
              .get(
                `${process.env.REACT_APP_API_URL}/api/tasks/canEdit/${id}/${userData?.userId}/canEdit`
              )
              .then((response) => {
                // setEdit(response.data);
                setCanEdit(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
          };
  useEffect(() => {
    checkEdit();
  }, []);
  const handleClick = (option) => {
    setSelectedOption(option);
    setShowOptions(false);

    // Navigate to corresponding page based on selected option
    switch (option) {
      case "Option1":
        navigate("/option1");
        break;
      case "Option2":
        navigate("/option2");
        break;
      case "Option3":
        navigate("/option3");
        break;
      default:
        break;
    }
  };
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.5 : 1;
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  };
  const formatISODate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const startDate = new Date(card?.startDate);
  const endDate = new Date(card?.endDate);
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
    if (!dateString) return ""; // Agar date nahi milti toh empty string return karo
    try {
      if (dateString.includes("/")) {
        const [day, month] = dateString.split("/");
        return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}`;
      } else {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth();
        return `${monthNames[month]} ${day}`;
      }
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }
  };
  const formatStartDate = formatDatee(card?.startDate);
  const formatEndDate = formatDatee(card?.endDate);
  let formattedFallbackDate = "";
  if (formatStartDate) {
    formattedFallbackDate = formatEndDate
      ? `${formatStartDate} | ${formatEndDate}`
      : formatStartDate;
  }
  const calculateDueMessage = (endDate) => {
    if (!endDate) return "";
    const end = new Date(endDate);
    const today = new Date();
    const differenceInTime = end.getTime() - today.getTime(); // Calculate the difference in milliseconds
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );
    // console.log('Difference in days:', differenceInDays);
    if (differenceInDays < 0) {
      // console.log('Overdue');
      return "Overdue";
    } else if (differenceInDays === 0) {
      // console.log('Due today');
      return "Due today";
    } else if (differenceInDays === 1) {
      // console.log('Due tomorrow');
      return "Due tomorrow";
    } else if (differenceInDays === 2) {
      // console.log('Due in 2 days');
      return "Due in 2 days";
    } else {
      // console.log('No due message');
      return "";
    }
  };
  const formatDate2 = (dateString) => {
    if (!dateString) return ""; // Return empty string if no date string provided
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return ""; // Return empty string if the date string is invalid
    }
    return date.toISOString().split("T")[0]; // Extracts the date part and returns in "YYYY-MM-DD" format
  };
  const endDateFormatted = formatDate2(card?.endDate);
  const dueMessage = calculateDueMessage(endDateFormatted);
  const generateAddTaskLog = (taskId, from) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action: "changeStatus",
      userName: userData?.name,
      details: {
        fromStatus: from ? from : "",
        toStatus: "Archive",
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };
  const archiveTask = async () => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `/api/tasks/${id}/status`,
        {
          status: "Archive",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // Handle successful update
        // console.log('Task archived successfully', response.data);
        // Optionally, update the card state or show a notification
      } else {
        // Handle error response
        console.error("Failed to archive task", response.data);
      }
      toast.dismiss();
      generateAddTaskLog(id, card?.status);
      toast.success("Task archived successfully");
      //   setInterval(() => {
      //     window.location.reload();
      //   }, 1000);
    } catch (error) {
      console.error("Error archiving task:", error);
    }
  };
  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleStatusChange = async (task, newStatus) => {
    console.log('newStatus', newStatus);
    if (newStatus === "Completed") {
      setCurrentCard(task);
      setIsCompleteModalOpen(true);
    } else if (newStatus === "Postponed") {
      setCurrentCard(task);
      setIsCancelModalOpen(true);
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/tasks/${task._id}/status`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update status");
        }

        const updatedTask = await response.json();
        setAllTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? { ...t, status: updatedTask.status } : t
          )
        );
        fetchTasks(); // Ensure this function is defined and working
        console.log("Task updated:", updatedTask);
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };
    useEffect(() => {
      if (isCompleteModalOpen && textareaRef.current) {
        textareaRef.current.focus(); // Focus the textarea when the modal opens
      }
    }, [isCompleteModalOpen]);
    useEffect(() => {
      if (isCancelModalOpen && inputRef.current) {
        inputRef.current.focus(); // Focus the textarea when the modal opens
      }
    }, [isCancelModalOpen]);
      useEffect(() => {
        if (isCompleteModalOpen && textareaRef.current) {
          textareaRef.current.focus(); // Focus the textarea when the modal opens
        }
      }, [isCompleteModalOpen]);

  const handleCompleteModalSubmit = async () => {
      const proofTextValue = textareaRef.current.value; // Access the value from textarea using ref
      const userId = userData?.userId;
      if (!userId) {
        console.error("User ID is required");
        toast.error("User ID is required");
        return;
      }
      if (!proofTextValue) {
        console.error("Proof text is required");
        toast.error("Proof text is required");
        return;
      }
  
      setLinkLoader(true);
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/tasks/${currentCard._id}/complete`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: proofTextValue, // Use the value from ref
              file: fileLink,
              userId: userId,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to update task status");
        }
  
        const updatedTask = await response.json();
        setLinkLoader(false);
        setAllTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === currentCard._id ? { ...t, status: updatedTask.status } : t
          )
        );
        fetchTasks();
        toast.dismiss();
        toast.success("Task Status Updated");
        handleCompleteModalClose();
        textareaRef.current.value = ""; // Clear the textarea after submission
        setFileLink(null);
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Failed to update task status");
      }
    };
  
    const handleCancelModalSubmit = async () => {
      const remarks = inputRef.current.value;
      if (!remarks || !selectedDate) {
        console.error("Remark text and date are required");
        toast.error("Remark text and date are required");
        return;
      }
  
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/tasks/${currentCard._id}/cancel`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              remark: {
                text: remarks,
                date: selectedDate.toISOString().split("T")[0],
              },
              additionalDetails: {}, // Add any other details if required
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to update task status");
        }
  
        // generateLog(currentCard._id, "apply_postponed"); // Ensure you have this function defined elsewhere
        fetchTasks();
        toast.dismiss();
        toast.success("Task Status Updated");
        handleCancelModalClose();
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Error updating task status");
      }
    };
  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    setCurrentCard(null);
    setProofText("");
    setProofFile(null);
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setCurrentCard(null);
    setRemarks("");
    setSelectedDate(new Date());
  };
  const generateLInk = (file) => {
    setLinkLoader(true);
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);

    console.log("formData", formData);

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
    setLinkLoader(false);

        setFileLink(res?.data?.result);
      })
      .catch((err) => {
    setLinkLoader(false);

        console.log(err);
      });
  };
  
  const closeAllModals = () => {
    setEdit(false); // Close the Edit modal
    setOpen(false); // Close the View modal
  };
  const handleEditModalClose = () => {
    setEdit(false); // Close Edit Modal
    // Wait for the Edit modal state to update before closing the View modal
    setTimeout(() => {
      setOpen(false); // Close View Modal
    }, 200);
  };
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div>
      <div
        ref={drag}
        style={{ opacity }}
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        <div className="flex-1 shadow-md flex flex-col gap-1 border bg-blue-50 p-2 rounded">
          <div className="mb-1 flex justify-between items-center font-bold text-xs">
            {card?.pendingSubTask ? (
              <p className="text-center font-semibold text-gray-800">
                {" "}
                (Subtask){" "}
              </p>
            ) : card?.isSubtask === true ?
              <>
                <div className="flex flex-col justify-start">
                  <p className=" font-semibold text-gray-800 mb-1">{truncateText(card?.taskName, 26)}</p>
                  <p className="text-gray-400">(Subtask of <span className="font-semibold text-gray-500 underline">{truncateText(card?.subtaskDetail?.parentTaskId?.taskName, 26)}</span>)</p>
                </div>

              </> : (
                <p>{truncateText(card?.taskName, 26)}</p>
              )}
            <div>
              <div
                className="relative inline-block text-left"
                ref={dropdownRef}
              >
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-[100%] border border-gray-300 shadow-sm p-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent "View" modal from opening
                      toggleDropdown(); // Show dropdown menu
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
                  </button>
                </div>

                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        className="text-gray-700 block px-4 hover:bg-gray-200 py-2 text-sm w-full text-left"
                        onClick={() => setOpen(true)} // Open View Modal
                      >
                        View
                      </button>
                      {canEdit && (
                        <button
                          className="text-gray-700 block px-4 hover:bg-gray-200 py-2 text-sm w-full text-left"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent "View" modal from opening
                            setEdit(true); // Open Edit Modal
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="text-gray-700 hover:bg-gray-200 block px-4 py-2 text-sm w-full text-left"
                        onClick={archiveTask}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm   bg-gray-200 text-black border px-1 rounded-[3px]">
              <div>
                <div className="text-[11px]">
                  {truncateText(
                    formattedDefaultDate || formattedFallbackDate,
                    13
                  )}
                </div>
              </div>
            </p>
            <div className="flex text-[13px] px-2 bg-blue-200 rounded-[4px] font-semibold items-center gap-2 border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person-check-fill"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
                />
                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              {truncateText(
                card?.people?.map((person) => person.name).join(", "),
                8
              )}
            </div>
          </div>
          <div className="flex justify-between mt-1 items-center">
            <div className="flex font-bold text-gray-500 text-[13px]">
              <svg
                fill="#808080"
                width="20px"
                className=""
                height="20px"
                viewBox="-3 0 32 32"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>group</title>
                <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path>
              </svg>
              {card?.taskGroup?.groupName
                ? truncateText(card.taskGroup.groupName, 9)
                : "No Group"}
            </div>

          </div>
          <div className="flex items-center justify-between gap-2">
            {/* status */}
            <div>
              {card.status === "Cancelled" &&
                card?.additionalDetails?.status === "rejected" && (
                  <div className="text-xs border p-1 px-2 rounded font-bold bg-red-400 ">
                    Rejected_Postponed
                  </div>
                )}
              {card.status === "Cancelled" &&
                card?.additionalDetails?.status !== "rejected" && (
                  <div className="text-xs border p-1 px-2 rounded font-bold bg-red-400 ">
                    {card?.status === "Cancelled" ? "Postponed" : "Postponed"}
                  </div>
                )}
              {card.status === "Completed" && (
                <Chip
                  className="text-[11px] border  px-1 rounded font-bold text-black  "
                  variant="soft"
                  color={
                    card.category === "Approved"
                      ? "success"
                      : card.category === "Unapproved"
                        ? "#3c3c3c"
                        : "gray"
                  }
                >
                  {card?.category || "Awaiting approval"}
                </Chip>
              )}
              {(card.status === "In Progress" ||
                card.status === "" ||
                !card.status) &&
                dueMessage && (
                  <div
                    className="text-[11px] border bg-yellow-400 px-2 font-bold rounded py-0.5"
                    variant="soft"
                  >
                    {dueMessage}
                  </div>
                )}
            </div>
            {/* select tag */}
            <div>
              <select
                onClick={(e) => e.stopPropagation()}
                disabled={card.status === "Completed"}
                id="card-status"
                className="bg-gray-50 text-[11px] border rounded-[3px] px-1 border-gray-300 text-gray-900 h-7 focus:ring-blue-500 focus:border-blue-500 block w-[130px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={card.status || ""}
                onChange={(e) => handleStatusChange(card, e.target.value)}
              >
                {/* <option value="" disabled>
              Change Status
            </option> */}
                <option value="">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
                <option value="Archive">Archive</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={closeAllModals} // Close both modals when View modal is closed
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="bg-white rounded-lg h-[min-500px] overflow-x-hidden">
          <ViewTask data={card} setOpen={setOpen} />
        </div>
      </Modal>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={edit}
        onClose={handleEditModalClose} // Close both modals when Edit modal is closed
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          className="overflow-auto bg-white "
          sx={{
            borderRadius: "md",
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="plain"
            sx={{ m: 1 }}
            onClick={handleEditModalClose} // Close both modals when clicked
          />
          <EditTask data={card} fetchTasks={fetchTasks} setEdit={setEdit} />
        </Sheet>
      </Modal>
      {isCompleteModalOpen && (
              <div
                className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-50"
                //   onClick={handleCompleteModalClose}
              >
                <div
                  className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                  <h2
                    id="complete-modal-title"
                    className="text-xl font-semibold text-gray-900 mb-4"
                  >
                    Complete Task
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="proofFile" className="block text-gray-700">
                        Proof of Work (File) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="file"
                        name="proofFile"
                        className="w-full bg-gray-100 text-black rounded-md border border-gray-300 px-3 py-2 text-sm"
                        id="proofFile"
                        onChange={(e) => {
                          generateLInk(e.target.files[0]);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="proofText" className="block text-gray-700">
                        Proof of Work (Text) <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        ref={textareaRef} // Assign the ref to textarea
                        name="proofText"
                        className="w-full h-24 bg-gray-100 text-black rounded-md border border-gray-300 px-3 py-2 text-sm "
                        id="proofText"
                        placeholder="Enter proof of work text..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={handleCompleteModalClose}
                      className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={linkLoader}
                      className="bg-blue-500 px-3 text-white rounded "
                      onClick={handleCompleteModalSubmit}
                      // disabled={!proofText}
                      // className={`${
                      //   !proofText
                      //     ? "bg-gray-400 text-gray-600"
                      //     : "bg-blue-500 text-white"
                      // } rounded-md px-4 py-2 text-sm font-semibold`}
                    >
                      {linkLoader?<CircularProgress size={20} />:"Submit"}
                    </button>
                  </div>
                </div>
              </div>
            )}
      
            {isCancelModalOpen && (
              <Modal
                aria-labelledby="postponed-modal-title"
                aria-describedby="postponed-modal-desc"
                open={isCancelModalOpen}
                onClose={handleCancelModalClose}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Sheet
                  variant="outlined"
                  sx={{
                    maxWidth: 1000,
                    borderRadius: "md",
                    p: 3,
                    boxShadow: "lg",
                    width: 400,
                  }}
                >
                  <Typography
                    component="h2"
                    id="postponed-modal-title"
                    level="h4"
                    textColor="inherit"
                    fontWeight="lg"
                    mb={1}
                  >
                    Postpone Task
                  </Typography>
                  <div className="grid gap-4">
                    <div className="gap-2 grid">
                      <label>
                        Select New Deadline Date{" "}
                        <span className="text-red-600 ">*</span>
                      </label>
                      <input
                        type="date"
                        className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        name="selectedDate"
                        id="selectedDate"
                        value={selectedDate.toISOString().split("T")[0]} // Convert date to string
                        onChange={(e) => setSelectedDate(new Date(e.target.value))} // Set selectedDate as Date object
                      />
                    </div>
                    <div className="gap-2 grid">
                      <label>
                        Remarks <span className="text-red-600 ">*</span>
                      </label>
                      <input
                        type="text"
                        name="remarks"
                        className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        id="remarks"
                        ref={inputRef}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleCancelModalClose} variant="plain">
                      Cancel
                    </Button>
                    <Button onClick={handleCancelModalSubmit}>Submit</Button>
                  </div>
                </Sheet>
              </Modal>
            )}
    </div>
  );
};
const DragAndDropComponent = ({
  tasksToDo,
  tasksCancelled,
  loading,
  setTasksToDo,
  tasksCompleted,
  tasksInProgress,
  fetchTasks,
}) => {
  const { userData } = useContext(UserContext);
  const [sections, setSections] = useState({
    Todo: tasksToDo,
    "In Progress": tasksInProgress,
    Completed: tasksCompleted,
    Postponed: tasksCancelled,
  });
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fileLink, setFileLink] = useState(null);
  const [pendingSubTasks, setPendingSubTasks] = useState([]);
  const [linkLoader, setLinkLoader] = useState(false);
  const generateLInk = (file) => {
    console.log("file", file);
    setLinkLoader(true);
    const formData = new FormData();
    formData.append("file", file);

    console.log("formData", formData);

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setLinkLoader(false);
        setFileLink(res?.data?.result);
      })
      .catch((err) => {
        setLinkLoader(false);
        console.log(err);
      });
  };

  const handleSubmit = () => {
    if (!proofText) {
      toast.error("Proof of Work (Text) is required");
      return;
    }
    handleCompleteModalSubmit(); // Call the submit handler if validation passes
  };
  const fetchPendingSubTask = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/subtask/alreadyAssigned/${userData?.userId}`
      )
      .then((res) => {
        console.log(
          "dafasfdsafdsaflkasdjflasdkfjlasdfjasdklfjasdkfjasdkfjasdkfjasdkfjlasdfj",
          [...tasksToDo, ...res?.data]
        );
        setPendingSubTasks(res?.data);
      });
  };
  useEffect(() => {
    fetchPendingSubTask();
  }, []);
  useEffect(() => {
    setSections({
      Todo: [...tasksToDo, ...pendingSubTasks],
      "In Progress": tasksInProgress,
      Completed: tasksCompleted,
      Postponed: tasksCancelled,
    });
  }, [
    tasksToDo,
    tasksInProgress,
    tasksCompleted,
    tasksCancelled,
    pendingSubTasks,
  ]);

  const updateTaskStatus = async (id, status, body) => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + `/api/tasks/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, ...body, additionalDetails: {} }), // Include additional data in the body
      }
    );
    toast.dismiss();
    toast.success("Task Status Updated");

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }

    return response.json();
  };
  const generateAddTaskLog = (taskId, from, to) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action: "changeStatus",
      userName: userData?.name,
      details: {
        fromStatus: from === "Todo" ? "" : from,
        toStatus: to === "Todo" ? "" : to,
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };

  const moveCard = async (id, toSection) => {
    const newSections = { ...sections };
    const fromSection = Object.keys(newSections).find((section) =>
      newSections[section].find((card) => card._id === id)
    );
    if (fromSection === "Completed") {
      toast.dismiss();
      toast.error(`Can't Move Completed Task to ${toSection}`);
      return;
    }
    if (fromSection !== toSection) {
      if (toSection === "Postponed") {
        const cardToMove = newSections[fromSection].find(
          (card) => card._id === id
        );
        setCurrentCard({ ...cardToMove, fromSection });
        setIsCancelModalOpen(true);

        return;
      } else if (toSection === "Completed") {
        const cardToMove = newSections[fromSection].find(
          (card) => card._id === id
        );
        setCurrentCard({ ...cardToMove, fromSection });
        setIsCompleteModalOpen(true);
        generateAddTaskLog(id, fromSection, toSection);

        return;
      }
      try {
        generateAddTaskLog(id, fromSection, toSection);
        let updatedStatus = toSection === "Todo" ? "" : toSection;
        const updatedTask = await updateTaskStatus(id, updatedStatus);
        const cardToMove = newSections[fromSection].find(
          (card) => card._id === id
        );
        newSections[fromSection] = newSections[fromSection].filter(
          (card) => card._id !== id
        );
        newSections[toSection] = [...newSections[toSection], cardToMove];
        cardToMove.status = toSection;
        setSections(newSections);
      } catch (error) {
        console.error("Error moving card:", error);
      }
    }
  };
  const generateLog = (taskId, action) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action,
      userName: userData?.name,
      details: {},
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };
  

  const handleCancelModalSubmit = async () => {
    if (!remarks || !selectedDate) {
      console.error("Remark text and date are required");
      return;
    }

    if (currentCard) {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL +
          `/api/tasks/${currentCard._id}/cancel`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              remark: {
                text: remarks,
                date: selectedDate.toISOString().split("T")[0],
              },
              additionalDetails: {},
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update task status");
        }
        generateLog(currentCard._id, "apply_postponed");

        const updatedTask = await response.json();
        toast.dismiss();
        toast.success("Task Status Updated");

        const newSections = { ...sections };
        newSections[currentCard.fromSection] = newSections[
          currentCard.fromSection
        ].filter((card) => card._id !== currentCard._id);
        newSections["Postponed"] = [
          ...newSections["Postponed"],
          { ...currentCard, status: "Postponed" },
        ];
        setSections(newSections);
        setIsCancelModalOpen(false);
        setCurrentCard(null);
        setRemarks("");
        setSelectedDate(new Date());
      } catch (error) {
        console.error("Error updating task status:", error);
        toast.error("Error updating task status");
      }
    }
  };

  const handleCancelModalClose = () => {
    setIsCancelModalOpen(false);
    setCurrentCard(null);
    setRemarks("");
    setSelectedDate(new Date()); // Reset selectedDate as a Date object
  };
  const [proofText, setProofText] = useState("");
  const [proofFile, setProofFile] = useState(null);

  const handleCompleteModalSubmit = async () => {
    if (!proofText) {
      console.error("Proof text is required");
      toast.error("Proof text is required");
      return;
    }
    setLinkLoader(true);

    try {
      // Use the helper function to get userId
      const userId = userData?.userId;
      if (!userId) {
        console.error("User ID is required");
        toast.error("User ID is required");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${currentCard._id}/complete`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: proofText,
            file: fileLink,
            userId: userId, // Include userId in the request body
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    setLinkLoader(false);


      const updatedTask = await response.json(); // Updated task object from API response

      // Update frontend state to reflect the completed task
      const updatedSections = { ...sections };
      updatedSections[currentCard.fromSection] = updatedSections[
        currentCard.fromSection
      ].filter((card) => card._id !== currentCard._id);
      updatedSections["Completed"] = [
        ...updatedSections["Completed"],
        { ...currentCard, status: "Completed" },
      ];
      setSections(updatedSections);
      toast.dismiss();
      toast.success("Task Status Updated");
      handleCompleteModalClose();
      setProofText("");
      setProofFile(null);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    setCurrentCard(null);
    setProofText("");
    setProofFile(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-4 gap-3 h-full  items-center ">
        {loading ? (
          <div className="flex items-center justify-center">
            <img src={Load} alt="" style={{ width: "600px" }} />
          </div>
        ) : (
          Object.entries(sections).map(([title, cards]) => (
            <Section
              key={title}
              title={title}
              cards={cards}
              loading={loading}
              fetchTasks={fetchTasks}
              moveCard={moveCard}
            />
          ))
        )}
      </div>
      {isCancelModalOpen && (
        <Modal
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
          open={isCancelModalOpen}
          onClose={handleCancelModalClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 1000,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              width: 400,
            }}
          >
            <ModalClose
              variant="outlined"
              sx={{
                top: "calc(-1/4 * var(--IconButton-size))",
                right: "calc(-1/4 * var(--IconButton-size))",
                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                borderRadius: "50%",
                bgcolor: "background.body",
              }}
            />
            <Typography
              component="h2"
              id="modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Reason to Postponed
            </Typography>
            <div className="grid gap-4">
              <div className="gap-2 grid">
                <label>
                  Remarks <span className="text-red-600 ">*</span>
                </label>
                <input
                  type="text"
                  name="remarks"
                  className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="gap-2 grid">
                <label>
                  Select New Deadline Date{" "}
                  <span className="text-red-600 ">*</span>
                </label>
                <input
                  type="date"
                  className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  name="selectedDate"
                  id="selectedDate"
                  value={selectedDate.toISOString().split("T")[0]} // Convert date to string
                  onChange={(e) => setSelectedDate(new Date(e.target.value))} // Set selectedDate as Date object
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleCancelModalClose} variant="plain">
                Cancel
              </Button>
              <Button onClick={handleCancelModalSubmit}>Submit</Button>
            </div>
          </Sheet>
        </Modal>
      )}
      {isCompleteModalOpen && (
        <Modal
          aria-labelledby="complete-modal-title"
          aria-describedby="complete-modal-desc"
          open={isCompleteModalOpen}
          onClose={handleCompleteModalClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              maxWidth: 1000,
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
              width: 400,
            }}
          >
            <Typography
              component="h2"
              id="complete-modal-title"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Complete Task
            </Typography>
            <div className="grid gap-4">
              <div className="gap-2 grid">
                <label>
                  Proof of Work (Text) <span className="text-red-600 ">*</span>
                </label>
                <textarea
                  name="proofText"
                  className="flex h-20 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="proofText"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                />
              </div>
              <div className="gap-2 grid">
                <label>
                  Proof of Work (File) <span className="text-red-600 ">*</span>
                </label>
                <input
                  type="file"
                  name="proofFile"
                  className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="proofFile"
                  onChange={(e) => {
                    // setProofFile(e.target.files[0])
                    generateLInk(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={handleCompleteModalClose} variant="plain">
                Cancel
              </Button>
              <Button onClick={handleCompleteModalSubmit} disabled={!proofText || linkLoader}>
                 {linkLoader ? <CircularProgress size={20} />:"Submit"}
              </Button>{" "}
              {/* Disable if proofText is empty */}
            </div>
          </Sheet>
        </Modal>
      )}
    </DndProvider>
  );
};
export default DragAndDropComponent;

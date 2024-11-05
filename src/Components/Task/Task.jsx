import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import DragAndDropComponent from "./Task Mange/DragAndDropComponent";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, IconButton } from "@mui/joy";
import debounce from "lodash.debounce";

import ReactQuill from "react-quill";
import { toast } from "react-toastify";
import { Autocomplete } from "@mui/joy";
import Add from "@mui/icons-material/Add";
import io from "socket.io-client";
import { CircularProgress } from "@mui/material";
import { UserContext } from "../../global/UserContext";
import MainTask from "./MainTask";

const socket = io(process.env.REACT_APP_API_URL);

function Task() {
  const { userData } = useContext(UserContext);
  const userDataString = localStorage.getItem("userData");
  const [tasks, setTasks] = useState([]);
  const [userid, setUserid] = useState(
    JSON.parse(userDataString)?.userId || ""
  );
  const selectedDateRef = useRef(null);
  const [tasksToDo, setTasksToDo] = useState([]);
  const [tasksInProgress, setTasksInProgress] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState([]);
  const [tasksCancelled, setTasksCancelled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [selectProjectLead, setProjectLead] = useState([]);
  const [selectMembers, setMembers] = useState([]);
  const [audioLoader, setAudioLoader] = useState(false);
  const [formData, setFormData] = useState({
    owner: { id: "" },
    taskGroup: { groupName: "", groupId: "" },
    taskName: "",
    description: "",
    audioFile: "",
    startDate: "",
    endDate: "",
    reminder: "",
    people: [],
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [uploadResultVoice, setuploadResultVoice] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [singleFile, setSingleFile] = useState("");
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setUserid(userId);
      setFormData((prevFormData) => ({
        ...prevFormData,
        owner: { id: userId },
      }));
    }
  }, []);


  const handleChange = (fieldName, value) => {
    if (fieldName === "people") {
      const selectedUsers = value.map((name) => {
        return selectMembers.find((member) => member.name === name);
      });
      setFormData((prevFormData) => ({
        ...prevFormData,
        [fieldName]: selectedUsers,
      }));
    } else if (fieldName === "taskGroup") {
      if (value) {
        const [groupName, groupId] = value.split("||");
        setFormData((prevFormData) => ({
          ...prevFormData,
          taskGroup: { groupName, groupId },
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          taskGroup: { groupName: "", groupId: "" },
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [fieldName]: value,
      }));
    }
  };
  const generateAddTaskLog = (taskId, formData) => {
    console.log("laskdfjalskfjladskfjsdlakfjsdafjsa", taskId);
    const data = {
      userId: userData?.userId,
      taskId,
      action: "create",
      userName: userData?.name,
      details: {
        member: [...formData.people],
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        resetForm();
        console.log("res", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { taskGroup, taskName, description, startDate, endDate } = formData;

    if (
      !taskGroup.groupId ||
      !taskName ||
      !description ||
      !startDate ||
      !endDate
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/tasksadd",
        { ...formData, audioFile: uploadResultVoice, pdfFile: singleFile }
      );
      // console.log(response.data);
      console.log(response.data);
      generateAddTaskLog(response.data.newTask._id, formData);
      // resetForm();
      setModal(false);
      // toast.success("Task created successfully!");
      await fetchTasks(); // Refetch tasks after creating a new one
      await fetchTasksmain();
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      owner: { id: userid },
      taskGroup: { groupName: "", groupId: "" },
      taskName: "",
      description: "",
      audioFile: "",
      startDate: "",
      endDate: "",
      reminder: "",
      people: [],
    });
  };

  const fetchGroupData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/groups"
      );
      setGroupData(response.data);
      // console.log("groupData", response.data);
    } catch (error) {
      // console.log("Error fetching Task: ", error);
    }
  };

  const fetchRegisteredNames = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/userData"
      );
      const filteredDepartmentHeads = response.data.filter(
        (user) => user.userRole === 1
      );
      setDepartmentHeads(filteredDepartmentHeads);
      const filteredProjectlead = response.data.filter(
        (user) => user.userRole === 2
      );
      setProjectLead(filteredProjectlead);
      const filterMember = response.data.filter(
        (user) =>
          user.userRole === 3 || user.userRole === 2 || user.userRole === 1
      );
      setMembers(filterMember);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const filterTasksByStatus = (tasks, status) =>
    tasks.filter(
      (task) => task.status === status || (status === "To Do" && !task.status)
    );

  const fetchTasks = async () => {
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
      setTasksToDo(filterTasksByStatus(filteredTasks, "To Do"));
      setTasksInProgress(filterTasksByStatus(filteredTasks, "In Progress"));
      setTasksCompleted(filterTasksByStatus(filteredTasks, "Completed"));
      setTasksCancelled(filterTasksByStatus(filteredTasks, "Cancelled"));
      setTaskGroups([
        ...new Set(filteredTasks.map((task) => task?.taskGroup?.groupName)),
      ]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTasksmain();
  }, []);

  // Inside your component

  useEffect(() => {
    // const debouncedFetchTasks = debounce(fetchTasks, 300); // 300ms debounce

    socket.on("newTask", (data) => {
      fetchTasks();
    });
    socket.on("taskStatusUpdate", (data) => {
      fetchTasks();
    });
    socket.on("taskCompleted", (data) => {
      fetchTasks();
    });
    // socket.on('taskStatusUpdate', debouncedFetchTasks);
    // socket.on('taskCompleted', debouncedFetchTasks);

    return () => {
      socket.off("newTask");
      socket.off("taskStatusUpdate");
      socket.off("taskCompleted");
    };
  }, []);

  useEffect(() => {
    fetchGroupData();
    fetchRegisteredNames();
  }, []);

  useEffect(() => {
    if (userid) {
      fetchTasks();
      fetchTasksmain();
    }
  }, [userid]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const groupName = searchParams.get("groupName");
    if (groupName) {
      setSelectedGroup(groupName);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedGroup !== "") {
      const filteredTasks = allTasks?.filter(
        (task) => task?.taskGroup?.groupName === selectedGroup
      );
      setTasksToDo(
        filteredTasks?.filter((task) => !task.status || task.status === "To Do")
      );
      setTasksInProgress(
        filteredTasks?.filter((task) => task.status === "In Progress")
      );
      setTasksCompleted(
        filteredTasks?.filter((task) => task.status === "Completed")
      );
      setTasksCancelled(
        filteredTasks?.filter((task) => task.status === "Cancelled")
      );
    } else {
      setTasksToDo(
        allTasks?.filter((task) => !task.status || task.status === "To Do")
      );
      setTasksInProgress(
        allTasks?.filter((task) => task.status === "In Progress")
      );
      setTasksCompleted(
        allTasks?.filter((task) => task.status === "Completed")
      );
      setTasksCancelled(
        allTasks?.filter((task) => task.status === "Cancelled")
      );
    }
  }, [selectedGroup, allTasks]);

  const toggleModal = () => {
    setModal(!modal);
    fetchGroupData();
    fetchRegisteredNames();
  };

  const startRecording = async (e) => {
    e.preventDefault();
    setIsRecording(true);
    audioChunksRef.current = [];
    console.log("start ");
    try {
      console.log("first try");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        await uploadAudio(audioBlob);
        console.log("last try", audioBlob);
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadAudio = async (audioBlob) => {
    setAudioLoader(true);
    console.log("alsjdfklsajfdlkafjdslkaf", audioBlob);
    const formData = new FormData();
    formData.append("voice", audioBlob, "recording.wav");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload-voice`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAudioLoader(false);

      setuploadResultVoice(response.data.result);
    } catch (error) {
      setAudioLoader(false);
    }
  };
  const uploadSingleFile = async (file) => {
    if (!file) {
      // setUploadResult('No file selected.');
      toast.dismiss();
      toast.error("Please select an file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSingleFile(response.data.result);
      toast.dismiss();
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleFileSelect = (event) => {
    uploadSingleFile(event.target.files[0]);
  };
  const handleUploadClick = () => {
    document.getElementById("image-upload").click();
  };
  const [allTasksmain, setAllTasksmain] = useState([]);
  const [filter, setFilter] = useState("To Do");
  const filteredTasks = filterTasksByStatus(allTasksmain, filter);

  useEffect(() => {
    if (userid) {
      fetchTasks();
    }
  }, [userid]);

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

      setAllTasksmain(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div>
      <div className=" lg:hidden ">
        <Button
          onClick={toggleModal}
          startDecorator={<Add />}
          variant="outlined"
          className="font-bold  text-black bg-gray-200 shadow border-gray-400 border-0  "
        >
          Add Tasks
        </Button>
        <MainTask
          filter={filter}
          setFilter={setFilter}
          filteredTasks={filteredTasks}
          fetchTasksmain={fetchTasksmain}
        />
      </div>
      {modal && (
        <div>
          <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed inset-0 flex items-center justify-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto max-h-full"
          >
            <div className="relative w-full max-w-4xl max-h-full">
              <div className="relative bg-white lg:rounded-lg rounded-[3px] shadow ">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 lg:rounded-lg rounded-[3px] text-sm p-1.5 ml-auto inline-flex items-center  "
                  data-modal-hide="default-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900 ">
                    Add Task
                  </h3>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="taskname"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Task Name <span className="text-red-500 ">*</span>
                        </label>
                        <input
                          type="text"
                          name="taskname"
                          id="taskname"
                          value={formData.taskName}
                          onChange={(e) =>
                            handleChange("taskName", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:rounded-lg rounded-[3px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Task Name"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="taskGroup"
                          className="block mb-2 text-sm font-medium text-gray-900"
                        >
                          Task Group <span className="text-red-500 ">*</span>
                        </label>
                        <select
                          className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={`${formData.taskGroup.groupName || ""}||${
                            formData.taskGroup.groupId || ""
                          }`}
                          onChange={(e) =>
                            handleChange("taskGroup", e.target.value)
                          }
                        >
                          <option value="">Select a Group</option>
                          {Array.isArray(groupData) && groupData.length > 0 ? (
                            groupData.map((group) => (
                              <option
                                key={group._id}
                                value={`${group.groupName}||${group._id}`}
                              >
                                {group.groupName}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No groups available
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Description <span className="text-red-500 ">*</span>
                      </label>
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(value) => handleChange("description", value)}
                        required
                      />
                    </div>

                    <div className="p-4 bg-white lg:rounded-lg rounded-[3px] shadow-md">
                      <label
                        htmlFor="taskname"
                        className="block mb-4 text-lg font-semibold text-gray-900"
                      >
                        Record Audio
                      </label>
                      <div className="flex space-x-4 mb-4 items-center">
                        {/* Start Recording Button */}
                        <button
                          onClick={(e)=>startRecording(e)}
                          disabled={isRecording}
                          className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${
                            isRecording
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                          aria-hidden={isRecording ? "true" : "false"}
                        >
                          {isRecording ? "Recording..." : "Start Recording"}
                        </button>

                        {/* Stop Recording Button */}
                        <button
                          onClick={(e)=>stopRecording(e)}
                          disabled={!isRecording}
                          className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${
                            !isRecording
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-stop-circle-fill mr-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z" />
                          </svg>
                          Stop Recording
                        </button>
                      </div>

                      {audioLoader ? (
                        <div className="flex justify-start">
                          <CircularProgress />
                        </div>
                      ) : uploadResultVoice ? (
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Playback:
                          </h3>
                          <audio
                            controls
                            src={uploadResultVoice}
                            className="w-full mb-2"
                          ></audio>
                          <button
                            // onClick={removeRecording}
                            onClick={(e) => {
                              e.preventDefault();
                              setuploadResultVoice(null);
                            }}
                            className="px-4 py-2 bg-red-600 flex items-center gap-2  text-white font-medium lg:rounded-md rounded-[3px] hover:bg-red-700 focus:outline-none"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="currentColor"
                              class="bi bi-x-circle-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                            </svg>{" "}
                            Remove
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="p-4">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-lg font-medium text-gray-900"
                      >
                        Upload File
                      </label>
                      <input
                        accept="file/*"
                        id="image-upload"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                      />
                      <button
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-cloud-arrow-up-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
                        </svg>
                        Upload
                      </button>
                      {singleFile && (
                        <div className="mt-4">
                          <h3 className="text-lg font-medium text-gray-800 mb-2">
                            Uploaded File:
                          </h3>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="currentColor"
                              className="bi bi-file-earmark"
                              viewBox="0 0 16 16"
                            >
                              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h4.5L14 4.5zM10 4a1 1 0 0 1-1-1V1.5L14 5h-3.5A1.5 1.5 0 0 1 9 3.5V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5H10z" />
                            </svg>
                            <a href={singleFile} className="ml-2 text-gray-700">
                              File
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Start Date <span className="text-red-500 ">*</span>
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleChange("startDate", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:rounded-lg rounded-[3px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="Start Date"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          End Date <span className="text-red-500 ">*</span>
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleChange("endDate", e.target.value)
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:rounded-lg rounded-[3px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          placeholder="End Date"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="people"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Select Members <span className="text-red-500 ">*</span>
                      </label>
                      <Autocomplete
                        placeholder="Assign to"
                        multiple
                        options={selectMembers.map((option) => option.name)}
                        onChange={(event, newValue) =>
                          handleChange("people", newValue)
                        }
                        value={formData.people.map((person) => person.name)}
                        renderInput={(params) => (
                          <input
                            {...params}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm lg:rounded-lg rounded-[3px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder="Select Members"
                          />
                        )}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium lg:rounded-lg rounded-[3px] text-sm px-5 py-2.5 text-center"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
        </div>
      )}
      <div className=" hidden lg:block">
        <div className="flex  flex-col h-full bg-white rounded text-black">
          <div className="flex items-center justify-between px-2">
            <div className="font-bold flex gap-3">
              <Button
                onClick={toggleModal}
                startDecorator={<Add />}
                variant="outlined"
                className="font-bold  text-black bg-gray-200 shadow border-gray-400 border-0  "
              >
                Add Tasks
              </Button>
            </div>
            <div className="flex items-center gap-3 text-lg font-bold">
              {/* <Button
              onClick={() => navigate("/unapproved-task")}
              variant="outlined"
              className="font-bold  text-black bg-gray-200 shadow border-gray-400 border-0"
            >
              {" "}
              Unapproved Task
            </Button> */}
              <Button
                onClick={() => navigate("/archive-task")}
                variant="outlined"
                className="font-bold  text-black bg-gray-200 shadow border-gray-400 border-0"
              >
                {" "}
                Archive Task
              </Button>

              <p>Filter By Groups</p>
              {taskGroups.length > 0 && (
                <Select
                  value={selectedGroup}
                  className="font-bold bg-gray-200 border-0"
                  onChange={(event, newValue) => setSelectedGroup(newValue)}
                >
                  <Option value="" className="font-bold">
                    All Tasks
                  </Option>
                  {taskGroups.map((group, index) => (
                    <Option
                      className="font-bold text-gray-400"
                      key={index}
                      value={group}
                    >
                      {group}
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            <DragAndDropComponent
              tasksToDo={tasksToDo}
              tasksInProgress={tasksInProgress}
              tasksCompleted={tasksCompleted}
              tasksCancelled={tasksCancelled}
              fetchTasks={fetchTasks}
              setTasksToDo={setTasksToDo}
              setTasksInProgress={setTasksInProgress}
              setTasksCompleted={setTasksCompleted}
              setTasksCancelled={setTasksCancelled}
              allTasks={allTasks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;

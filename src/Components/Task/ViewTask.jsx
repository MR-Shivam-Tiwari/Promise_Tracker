import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../global/UserContext";
import { toast } from "react-toastify";
// import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import moment from "moment";
import Logs from "../logs/Logs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
} from "@mui/material";
import io from "socket.io-client";
import { useRef } from "react";
import CommentComponent from "../Comments/CommentComponent";
import { Autocomplete, TextField } from "@mui/joy";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
const socket = io(process.env.REACT_APP_API_URL);
function ViewTask({ data, status, setOpen }) {
  // console.log("status", status)
  // console.log("task", data)
  const [subTasks, setSubTasks] = useState([]);
  const { userData } = useContext(UserContext);
  const [userTasks, setUserTasks] = useState([]);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(new Set()); // Track expanded tasks
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectmembers, setMembers] = useState([]);
  const [selectProjectLead, setProjectLead] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newSubTask, setNewSubTask] = useState({
    subTaskName: "",
    description: "",
  });
  const [selectedNames, setSelectedNames] = useState([]);

  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];

  const handleSelectChange = (selectedMember) => {
    // Check if the member is already in the selected array
    const isAlreadySelected = selectedNames.some(member => member?.userId === selectedMember?.userId);

    if (!isAlreadySelected && selectedMember != null) {
      // Add the new member object to the selectedNames array
      setSelectedNames([...selectedNames, selectedMember]);
      console.log([...selectedNames, selectedMember]);
    }
  };

  const handleRemoveName = (id) => {
    setSelectedNames(selectedNames.filter((n) => n.userId !== id));
  };

  useEffect(() => {
    const fetchRegisteredNames = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/api/userData"
        );
        const filteredDepartmentHeads = response.data.filter(
          (user) => user.userRole === 1
        );
        setDepartmentHeads(filteredDepartmentHeads);
        const filteredProjectLead = response.data.filter(
          (user) => user.userRole === 2
        );
        setProjectLead(filteredProjectLead);
        const filterMember = response.data.filter(
          (user) => user.userRole === 3
        );
        // setMembers(filterMember);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const getMember = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/${data?.taskGroup?.groupId}/members`)
        .then((res) => {
          setMembers(res.data?.members)
        }).catch(err => {
          console.log(err)
        })
    }

    fetchRegisteredNames();
    getMember()
  }, []);


  const [loader, setLoader] = useState(false);
  const [logs, setLogs] = useState([]);

  const [selectedOption, setSelectedOption] = useState("all");
  const [filterUserTasks, setFilterUserTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(true); // State to control accordion open/close
  const [inputValue, setInputValue] = useState('');


  const handleEditModal = (subTaskId) => {
    // const currentSubTask = subTasks.find((subTask) => subTask._id === subTaskId);
    // setNewSubTask({
    //   subTaskName: currentSubTask?.subTaskName,
    //   description: currentSubTask?.description,
    // });

    setIsEditing(true);
    setCurrentTaskId(subTaskId);
    setShowModal(true);
    // setSelectedNames(currentSubTask?.assignedTo || []);
  }


  const toggleAccordion = () => {
    setIsOpen(!isOpen); // Toggle open/close state
  };


  const getAllUserSubTasks = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/subtask/${data?._id}/task/${userData?.userId}/user_tasks`
      )
      .then((res) => {
        setSubTasks(res.data);
        // setSelectedNames(res.data?.assignedTo || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllSubTasks = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/subtask/${data?._id}`
      )
      .then((res) => {
        setSubTasks(res.data);
        // setSelectedNames(res.data?.assignedTo || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const getAllLogs = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/logs/${data?._id}`)
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllLogs();
  }, []);

  const getAllUserTasks = () => {
    setLoader(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/subtask/assigned/${userData?.userId}`
      )
      .then((res) => {
        setUserTasks(res.data);
        setLoader(false);
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
      });
  };

  useEffect(() => {
    // getAllUserSubTasks();
    getAllSubTasks()
    getAllUserTasks();
  }, []);

  const toggleTask = (id) => {
    setExpandedTasks((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id); // Close task if already open
      } else {
        newExpanded.add(id); // Open task
      }
      return newExpanded;
    });
  };

  const toggleCompletion = async (id, oldStatus) => {
    setLoader(true);
    // const taskToUpdate = subTasks.find((task) => task._id === id);
    // const newStatus = taskToUpdate.status === "pending" ? "done" : "pending";
    try {

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${id}/status`, {
        status: oldStatus === "Completed" ? "In Progress" : "Completed"
      },
      );


      getAllSubTasks();
    }
    catch (err) {
      console.log(err)
    }

  };

  const handleCreateOrUpdateSubTask = async (e) => {
    setLoader(true);
    e.preventDefault();

    const apiUrl = isEditing
      ? `${process.env.REACT_APP_API_URL}/api/subtask/${currentTaskId}`
      : `${process.env.REACT_APP_API_URL}/api/subtask`;

    const method = isEditing ? "put" : "post";

    try {
      const res = await axios[method](apiUrl, {
        userId: userData?.userId,
        parentTask: data?._id,
        ...newSubTask,
        assignedTo: selectedNames,
      });

      // Log creation action
      await generateLog(data._id, isEditing ? "edit_subtask" : "create_subtask");

      // Perform actions after log creation
      // getAllUserSubTasks();
      getAllSubTasks()
      setShowModal(false);
      setNewSubTask({ subTaskName: "", description: "" });
      setIsEditing(false);
      setCurrentTaskId(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };


  const handleCloseModal = () => {
    console.log('closed');
    setShowModal(false);
    // setNewSubTask({ subTaskName: "", description: "" });
    // setIsEditing(false);
    // setCurrentTaskId(null);
  };

  useEffect(() => {
    // getAllUserSubTasks();
    getAllSubTasks();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  const contentStyle = {
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "0.5rem",
  };

  function getRandomColor(index) {
    const colors = ["#34D399", "#60A5FA", "#F87171", "#FBBF24", "#A78BFA"]; // Add more colors as needed
    return colors[index % colors.length];
  }

  const authorizedPersonForEdit = (subTask) => {
    if (userData?.userId === data?.owner?.id) {
      return true
    }
    if (userData?.userId === subTask?._id) {
      return true
    }

    return false
  }

  const authorizedPersonForDone = (subTask) => {
    if (userData?.userId === data?.owner?.id) {
      return true
    }
    if (userData?.userId === subTask?.userId) {
      return true
    }
    if (subTask?.assignedTo?.find((i) => i.userId === userData?.userId)) {
      return true
    }
    return false
  }

  const generateLog = (taskId, action, customDetails) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action,
      userName: userData?.name,
      details: customDetails || {
        subTaskName: newSubTask.subTaskName,
        assign_to: selectedNames,
      },
    };
    return axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
        getAllLogs();
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
        throw err; // Throw error to handle it properly in the calling function
      });
  };



  return (
    <div className="lg:rounded-lg rounded-[3px] ">
      <div class="flex lg:px-5 px-3 pt-2 lg:pt-4 items-center justify-between mb-6 ">
        <div className="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900 ">
            {data?.taskGroup.groupName}
          </h1>
          <span className="text-gray-600 font-bold">
            (Status : {data?.status || "To Do"})
          </span>
          {data?.isSubtask && <span className="text-gray-600 font-semibold">
            (Subtask of <span className="font-bold underline">{data?.subtaskDetail?.parentTaskId?.taskName}</span>)
          </span>}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
          type="button"
          class="close font-bold text-4xl"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="container mx-auto lg:rounded-lg rounded-[3px]  p-0 h-[80vh] md:w-[75vw] w-[90vw] overflow-scroll overflow-x-hidden ">
        <div class=" lg:rounded-lg rounded-[3px] px-2   lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <h2 class="text-md font-medium text-gray-900  mb-2">Task Name</h2>

              <input
                disabled
                type="text"
                value={data?.taskName}
                id="first_name"
                class="bg-gray-100 p-4 rounded-lg w-full "
                placeholder="John"
                required
              />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900  mb-1">
                Task Description
              </h2>
              <div
                className="bg-gray-100 p-4 rounded"
                style={contentStyle}
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 align-center">
            {data?.audioFile ? (
              <div class=" ">
                <div>
                  <h2 className="text-lg font-medium text-gray-900  mb-1">
                    Audio Player
                  </h2>
                  <audio className="w-full" controls>
                    <source src={data?.audioFile} type="audio/mp4" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ) : null}
            {data?.pdfFile && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Attached File
                </h3>
                <a
                  href={data?.pdfFile}
                  className="flex items-center  bg-blue-400 hover:bg-blue-300 cursor-pointer p-4 lg:rounded-lg rounded-[3px] "
                >
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
                  <span className="ml-2 font-bold ">Download File</span>
                </a>
              </div>
            )}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="">
              <h2 className="text-lg font-medium text-gray-900  mb-2">
                Assigned By
              </h2>

              <p className="text-gray-700 bg-gray-200 rounded-lg p-2 mb-2 gap-2 flex  ">
                <p class="font-bold  bg-yellow-500 px-2 rounded text-white">
                  {" "}
                  {data?.owner?.name}
                </p>
              </p>
            </div>
            <div>
              <h2 class="text-lg font-medium text-gray-900  mb-2">
                Assigned To
              </h2>
              <div className="flex flex-wrap gap-2 bg-gray-200 rounded-lg p-2 ">
                {data?.people.map((person, index) => (
                  <p
                    key={index}
                    className={`font-bold text-white  px-2 rounded`}
                    style={{
                      backgroundColor: getRandomColor(index),
                      lineHeight: "1.5rem",
                      whiteSpace: "nowrap",
                      // height: "2.5rem",
                    }}
                  >
                    {person.name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center   ">
            {/* <div>
              <h2 class="text-lg font-medium text-gray-900  mb-2">Reminder</h2>
              <div class="flex items-center  bg-gray-200 rounded">
                <div className="flex items-center gap-2 w-full p-4  ">
                  <span className="text-black-900 flex text-black items-center gap-2 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-alarm"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                      <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                    </svg>{" "}
                    {data?.reminder}
                  </span>
                </div>
              </div>
            </div> */}
            <div>
              <h2 className="text-lg font-medium text-gray-900  mb-2">Dates</h2>
              <div className="bg-gray-200 p-2 lg:flex items-center rounded">
                <p className="text-gray-700  text-xs lg:text-[15px] gap-2 flex  ">
                  Start  :
                  <p className="border px-2 font-bold text-xs  lg:text-[15px] rounded bg-gray-200">
                    {data?.startDate ? formatDate(data.startDate) : "N/A"}
                  </p>
                </p>
                <div className="bg-gray-200 p-2 lg:flex items-center rounded">
                  <p className="text-xs lg:text-[15px] text-start flex gap-2 ">
                    End :{" "}
                    <p

                      className="border px-2 font-bold text-xs  lg:text-[15px] rounded bg-gray-200"
                    >
                      {data?.endDate ? formatDate(data.endDate) : "N/A"}
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {data?.additionalDetails?.status === "rejected" &&
            data?.status === "Cancelled" && (
              <div>
                <hr />
                <div>
                  <h2 className="text-lg font-bold text-gray-900  mb-2">
                    Reason For Rejection{" "}
                  </h2>
                  <p className="text-gray-700 mb-2 ml-4 gap-2 flex  ">
                    {data?.additionalDetails?.remarks}
                  </p>
                </div>
              </div>
            )}
          <hr className="mt-4 mb-4 " />

          {/* comment show here */}
       {!data?.isSubtask &&   <div className="mt-4 select-none">
            <div>

              <CommentComponent getAllLogs={getAllLogs} data={data} />

            </div>
          </div>}
          <hr className="mt-4 mb-4 " />
          {!data?.isSubtask && <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">
                  Sub Tasks{" "}
                  <span className="text-white cursor-pointer px-1 py-1 text-[10px] bg-orange-500 rounded-lg  font-bold">
                    {" "}
                    {
                      subTasks?.filter((subTask) => subTask.status === "done")
                        .length
                    }
                    /{subTasks?.length}
                  </span>
                </h3>
                {/* <p className="text-gray-500 w-[200px] ">
                  Below Subtasks are only visible to you
                </p> */}
              </div>
              <button
                className={`px-4 py-1 text-md rounded text-white hover:bg-green-700 active:bg-green-900 ${"bg-green-800"}`}
                onClick={() => {
                  setIsEditing(false);
                  setShowModal(true);
                }}
              >
                Create
              </button>
            </div>
            {subTasks?.map((subTask) => {
              return (
                <>
                  <div key={subTask._id} className="mx-4 mb-4">
                    <div
                      className="flex justify-between items-center px-2 py-1 bg-white rounded shadow cursor-pointer"
                      onClick={() => toggleTask(subTask._id)}
                    >
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <span
                            className={`h-4 w-4 rounded-full mr-3 ${subTask.status === "done"
                              ? "bg-green-600"
                              : "bg-gray-300"
                              }`}
                          ></span>
                          <span
                            className={`text-md font-semibold ${subTask.status === "done"
                              ? "line-through text-gray-500"
                              : ""
                              } cursor-pointer select-none`}
                          >
                            {subTask.taskName}
                          </span>
                        </div>
                        <div className="flex justify-start items-center gap-2">
                          {subTask?.assignedTo?.map((name) => (
                            <span
                              key={name.userId}
                              className=" px-3 py-1 bg-blue-500 text-white rounded-full text-xs"
                            >
                              {name.name}

                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex  items-center space-x-4">
                        {authorizedPersonForEdit(subTask) && <button onClick={() => {
                          handleEditModal(subTask._id)
                        }} className=" px-2 py-1 text-sm bg-yellow-500 text-white rounded">
                          Edit
                        </button>}
                        {authorizedPersonForDone(subTask) && <button
                          className={`px-2 py-1 text-sm rounded text-white ${subTask.status === "Completed"
                            ? "bg-red-500"
                            : "bg-green-500"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompletion(subTask._id, subTask.status);
                          }}
                        >
                          {subTask.status === "Completed" ? "Undo" : "Done"}
                        </button>}

                      </div>
                    </div>

                  </div>
                </>
              );
            })}
          </div>}
          {
            // sub task modal
            showModal &&
            (
              <>
                <SubTaskModal  getAllLogs={getAllLogs} currentTaskId={currentTaskId} isEditing={isEditing} parentTaskId={data._id} data={data} toggleModal={handleCloseModal} getAllSubTasks={getAllSubTasks} />
              </>
            )
          }
          <div className="text-black">
            <div>{status}</div>
          </div>
          <hr className="font-bold text-gray-800" />
          {!data?.isSubtask && <div>
            <h3
              className="text-black text-lg mb-5 font-bold cursor-pointer"
              onClick={toggleAccordion} // Trigger accordion open/close on click
            >
              All logs{" "}
              <span className="text-gray-500 font-bold text-md">({logs?.length})</span>
              <span className="ml-2 text-sm text-gray-500">
                {isOpen ? "▲" : "▼"}
              </span>
            </h3>
            {isOpen && ( // Show logs only if accordion is open
              <div className="space-y-2">
                {logs?.map((log, index) => (
                  <div key={index} className="">
                    <Logs log={log} />
                  </div>
                ))}
              </div>
            )}
          </div>}

        </div>
      </div>
    </div>
  );
}

export default ViewTask;


// create subtask old code 

const SubTaskModal = ({ parentTaskId, data, isEditing, toggleModal,getAllLogs, getAllSubTasks, currentTaskId }) => {
  const { userData } = useContext(UserContext);
  const userDataString = localStorage.getItem("userData");
  const [userid, setUserid] = useState(
    JSON.parse(userDataString)?.userId || ""
  );
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
  const [allMemberOfGroup, setAllMemberOfGroup] = useState([]);
  const [formData, setFormData] = useState({
    owner: { id: "" },
    taskGroup: data?.taskGroup,
    taskName: "",
    description: "",
    audioFile: "",
    startDate: "",
    endDate: "",
    reminder: "",
    people: [],
    isSubtask: true,
    subtaskDetail: {
      parentTaskId: parentTaskId
    }
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

  const generateLog = (taskId, action, customDetails) => {
    console.log("customDetails");
    const logData = {
      userId: userData?.userId,
      taskId,
      action,
      userName: userData?.name,
      details: customDetails || {
        subTaskName: formData?.taskName,
        assign_to: formData?.people,
      },
    };
    return axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, logData)
      .then((res) => {
        console.log("res", res.data);
        getAllLogs();
    console.log("customDetails");

      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
        throw err; // Throw error to handle it properly in the calling function
      });
  };
  const getTaskDetail = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${currentTaskId}`)
      .then((res) => {
        setFormData(prev => {
          return { ...prev, ...res.data }
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {
    if (isEditing) {
      getTaskDetail()
    }
  }, [currentTaskId]);



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

    let apiUrl = "";
    let method = "POST";

    if (isEditing) {
      apiUrl = "/api/tasksedit/" + currentTaskId;
      method = "PUT";
    } else {
      apiUrl = "/api/tasksadd";
    }

    try {
      const response = await axios({
        method: method,
        url: process.env.REACT_APP_API_URL + apiUrl,
        data: {
          ...formData,
          audioFile: uploadResultVoice,
          pdfFile: singleFile
        }
      });


      await generateLog(data?._id, isEditing ? "edit_subtask" : "create_subtask");
      
      console.log("above tollge")
      // Reset the form and close the modal immediately
      resetForm();
      // getAllLogs();
      toggleModal(); // Close modal immediately after the task is saved
      await fetchTasks(); // Refetch tasks after creating a new one
      await fetchTasksmain();
      getAllSubTasks();
    } catch (error) {
      console.error("Error creating or updating task:", error);
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

  const getAllMemberByGroup = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/members/${formData?.taskGroup?.groupId}`)
      .then((res) => {
        // console.log("res",res.data);
        const apiData = res.data;
        setAllMemberOfGroup([...apiData.members, ...apiData.deptHead, ...apiData.projectLead]);
      })
  }
  useEffect(() => {
    // fetchRegisteredNames();
    // fetchGroupData();
    if (formData?.taskGroup?.groupId) {
      getAllMemberByGroup();
    }
  }, [formData?.taskGroup?.groupId]);

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

  // const toggleModal = () => {
  //   setModal(!modal);
  //   // fetchGroupData();
  //   // fetchRegisteredNames();
  // };

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
    <>
      <div>
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 flex items-center justify-center z-50 w-full p-2 overflow-x-hidden overflow-y-auto max-h-full"
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
                  {isEditing ? "Edit SubTask" : " Add SubTask"}
                </h3>
                <form className="space-y-3" onSubmit={handleSubmit}>
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
                    {/*task group selector*/}
                    <div>
                      <label
                        htmlFor="taskGroup"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Task Group <span className="text-red-500 ">*</span>
                      </label>
                      <select
                        disabled
                        className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={`${formData.taskGroup.groupName || ""}||${formData.taskGroup.groupId || ""
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
                  {/* peoples */}
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
                      options={allMemberOfGroup?.map((option) => option.name)}
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
                  <div className="grid grid-cols-2 gap-3">
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
                          onClick={(e) => startRecording(e)}
                          disabled={isRecording}
                          className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${isRecording
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                          aria-hidden={isRecording ? "true" : "false"}
                        >
                          {isRecording ? "Recording..." : "Start Recording"}
                        </button>

                        {/* Stop Recording Button */}
                        <button
                          onClick={(e) => stopRecording(e)}
                          disabled={!isRecording}
                          className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${!isRecording
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
                    <div className="p-4 bg-white lg:rounded-lg rounded-[3px] shadow-md">
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
                      <div className="flex justify-center">


                        <button
                          onClick={handleUploadClick}
                          className=" items-center w-[200px] flex justify-center gap-3 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
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
                      </div>
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
                            <a
                              href={singleFile}
                              className="ml-2 text-gray-700"
                            >
                              File
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
    </>
  )
}

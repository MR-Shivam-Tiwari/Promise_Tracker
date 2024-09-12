import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../global/UserContext";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import Logs from "../logs/Logs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import CommentComponent from "../Comments/CommentComponent";

function ViewTask({ data, status, setOpen }) {
  // console.log("status", status)
  // console.log("task", data)
  const [subTasks, setSubTasks] = useState([]);
  const { userData } = useContext(UserContext);
  const [userTasks, setUserTasks] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState(new Set()); // Track expanded tasks
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newSubTask, setNewSubTask] = useState({
    subTaskName: "",
    description: "",
  });
  const [loader, setLoader] = useState(false);
  const [logs, setLogs] = useState([]);

  const [selectedOption, setSelectedOption] = useState("all");
  const [filterUserTasks, setFilterUserTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // State to control accordion open/close






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
    getAllUserSubTasks();
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

  const toggleCompletion = (id) => {
    setLoader(true);
    const taskToUpdate = subTasks.find((task) => task._id === id);
    const newStatus = taskToUpdate.status === "pending" ? "done" : "pending";

    axios
      .put(`${process.env.REACT_APP_API_URL}/api/subtask/${id}`, {
        status: newStatus,
      })
      .then((res) => {
        setLoader(false);
        setSubTasks(
          subTasks.map((task) =>
            task._id === id ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const handleCreateOrUpdateSubTask = (e) => {
    setLoader(true);
    e.preventDefault();
    const apiUrl = isEditing
      ? `${process.env.REACT_APP_API_URL}/api/subtask/${currentTaskId}`
      : `${process.env.REACT_APP_API_URL}/api/subtask`;

    const method = isEditing ? "put" : "post";

    axios[method](apiUrl, {
      userId: userData?.userId,
      parentTask: data?._id,
      ...newSubTask,
    })
      .then((res) => {
        setLoader(false);
        // if (isEditing) {
        //     setSubTasks(subTasks.map(task =>
        //         task._id === currentTaskId ? res.data : task
        //     ));
        // } else {
        //     setSubTasks([...subTasks, res.data]);
        // }
        getAllUserSubTasks();

        setShowModal(false);
        setNewSubTask({ subTaskName: "", description: "" });
        setIsEditing(false);
        setCurrentTaskId(null);
      })
      .catch((err) => {
        setLoader(false);
        console.log(err);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewSubTask({ subTaskName: "", description: "" });
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  useEffect(() => {
    getAllUserSubTasks();
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

  return (
    <div className="lg:rounded-lg rounded-[3px] ">
      <div class="flex lg:px-5 px-3 pt-2 lg:pt-4 items-center justify-between mb-6 ">
        <div className="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900 ">
            {data?.taskGroup.groupName}
          </h1>
          <span className="text-gray-600 font-bold">
            ({data?.status || "To Do"})
          </span>
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
          <div className="mt-4 select-none">
            <div>
             
                <CommentComponent data={data}/>

            </div>
          </div>
          <hr className="mt-4 mb-4 " />
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold">
                  Your Sub Tasks{" "}
                  <span className="text-white cursor-pointer px-1 py-1 text-[10px] bg-orange-500 rounded-lg  font-bold">
                    {" "}
                    {
                      subTasks?.filter((subTask) => subTask.status === "done")
                        .length
                    }
                    /{subTasks?.length}
                  </span>
                </h3>
                <p className="text-gray-500 w-[200px] ">
                  Below Subtasks are only visible to you
                </p>
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
                      <div className="flex items-center">
                        <span
                          className={`h-4 w-4 rounded-full mr-3 ${subTask.status === "done"
                            ? "bg-green-600"
                            : "bg-gray-300"
                            }`}
                        ></span>
                        <span
                          className={`text-sm ${subTask.status === "done"
                            ? "line-through text-gray-500"
                            : ""
                            } cursor-pointer select-none`}
                        >
                          {subTask.subTaskName}
                        </span>
                      </div>
                      <div className="flex  items-center space-x-4">
                        <button
                          className={`px-2 py-1 text-sm rounded text-white ${subTask.status === "done"
                            ? "bg-red-500"
                            : "bg-green-500"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompletion(subTask._id);
                          }}
                        >
                          {subTask.status === "done" ? "Undo" : "Done"}
                        </button>
                        {/* <button
                                                            className=" px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // openEditModal(subTask);
                                                            }}
                                                        >
                                                            Edit
                                                        </button> */}
                      </div>
                    </div>
                    {/* {expandedTasks.has(subTask._id) && (
                                                    <div className="p-1 mx-[40px] bg-red-100 rounded shadow mt-2">
                                                        {subTask?.description?<p className='font-normal text-sm'><span className='font-bold text-md'>Description :</span>{subTask.description}</p>:'No description provided'}
                                                    </div>
                                                )} */}
                  </div>
                </>
              );
            })}
          </div>
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => handleCloseModal()} // Close modal on backdrop click
            >
              <div
                className="bg-white p-6 rounded shadow-lg md:w-[500px] "
                onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
              >
                <h2 className="text-2xl font-semibold mb-4">
                  {isEditing ? "Edit Subtask" : "Create Subtask"}
                </h2>
                <form onSubmit={handleCreateOrUpdateSubTask}>
                  <div className="mb-4">
                    <label className="block text-md font-medium text-gray-700">
                      Subtask Name <span className="text-red-600 ">*</span>
                    </label>
                    <input
                      type="text"
                      value={newSubTask?.subTaskName}
                      onChange={(e) =>
                        setNewSubTask({
                          ...newSubTask,
                          subTaskName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border  border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-md font-medium text-gray-700">
                      Description <span className="text-red-600 ">*</span>
                    </label>
                    <textarea
                      value={newSubTask?.description}
                      onChange={(e) =>
                        setNewSubTask({
                          ...newSubTask,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full  border border-gray-300 rounded px-3 py-2"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-2 py-1 text-md font-normal bg-gray-500 text-white rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-2 py-1 text-md font-normal bg-blue-500 text-white rounded"
                    >
                      {isEditing ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="text-black">
            <div>{status}</div>
          </div>
          <hr className="font-bold text-gray-800" />
          <div>
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
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default ViewTask;

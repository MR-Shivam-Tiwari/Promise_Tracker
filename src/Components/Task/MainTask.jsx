import { Button, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import EditTask from "./EditTask";
import ViewTask from "./ViewTask";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";

function MainTask({ setFilter, filteredTasks, fetchTasksmain, filter }) {
  const [allTasks, setAllTasks] = useState([]);
  const { userData } = useContext(UserContext);
  const textareaRef = useRef(null);
  const inputRef = useRef(null);
  const [edit, setEdit] = useState(false);
  const userDataString = localStorage.getItem("userData");
  const [userid, setUserid] = useState(
    JSON.parse(userDataString)?.userId || ""
  );

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
  const handleTextChange = (value) => {
    // console.log("Textarea value:", e.target.value); // Debugging line
    setProofText(value);
  };
  const handleCompleteModalSubmit = async () => {
    const proofTextValue = textareaRef.current.value; // Access the value from textarea using ref

    if (!proofTextValue) {
      console.error("Proof text is required");
      toast.error("Proof text is required");
      return;
    }

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
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      const updatedTask = await response.json();

      setAllTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === currentCard._id ? { ...t, status: updatedTask.status } : t
        )
      );
      fetchTasksmain();
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

      generateLog(currentCard._id, "apply_postponed"); // Ensure you have this function defined elsewhere
      fetchTasksmain();
      toast.dismiss();
      toast.success("Task Status Updated");
      handleCancelModalClose();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Error updating task status");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
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
        fetchTasksmain(); // Ensure this function is defined and working
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };
  const generateLInk = (file) => {
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
        setFileLink(res?.data?.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const statusMapping = {
    "To Do": "To Do",
    "In Progress": "In Progress",
    Completed: "Completed",
    Cancelled: "Postponed", // Display "Postponed" but keep "Cancelled" in the code
  };
  const TaskCard = ({ task }) => (
    <div className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-md font-semibold text-blue-700 mb-2">
          {truncateText(task.taskName, 26)}
        </h2>
        <div className="flex  gap-2 items-center">
          <button
            onClick={() => {
              setSelectedTask(task);
              setEdit(true);
            }}
            className="border hover:bg-gray-200  p-1.5 px-2 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-square"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              setviewSelectedTask(task);
              setOpen(true);
            }}
            className="border hover:bg-gray-200 p-1.5 px-2 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-eye"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex mt-3 items-center justify-between">
        <p className="text-sm bg-gray-200 text-black border px-1 rounded-[3px]">
          <div className="flex text-[12px] px-1 gap-1">
            <div className="text-[11px]">
              {truncateText(formatDate(task?.startDate), 20)}
            </div>
            To
            <div className="text-[11px]">
              {truncateText(formatDate(task?.endDate), 20)}
            </div>
          </div>
        </p>
        <div className="flex text-[13px] px-2 bg-blue-200 rounded-[4px] font-semibold items-center gap-2 border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-check-fill"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"
            />
            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
          {truncateText(
            task?.people.map((person) => person.name).join(", "),
            14
          )}
        </div>
      </div>
      <div className="flex justify-between mt-3 items-center">
        <div className="flex font-bold text-gray-500 text-[13px]">
          <svg
            fill="#808080"
            width="20px"
            height="20px"
            viewBox="-3 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>group</title>
            <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path>
          </svg>
          {task?.taskGroup?.groupName
            ? truncateText(task.taskGroup.groupName, 16)
            : "No Group"}
        </div>
        <div>
          <select
            disabled={task.status === "Completed"}
            id="task-status"
            className="bg-gray-50 text-[11px] border rounded-[3px] px-1 border-gray-300 text-gray-900 h-7 focus:ring-blue-500 focus:border-blue-500 block w-[130px] dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={task.status || ""}
            onChange={(e) => handleStatusChange(task, e.target.value)}
          >
            <option value="" disabled>
              Change Status
            </option>
            <option value="">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Postponed">Postponed</option>
            <option value="Archive">Archive</option>
          </select>
        </div>
      </div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          className="overflow-auto  h-[620px] w-[340px] "
          sx={{
            borderRadius: "md",
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="plain"
            sx={{ m: 1 }}
            onClick={() => setSelectedTask(null)}
          />
          {selectedTask && (
            <EditTask
              data={selectedTask}
              fetchTasks={fetchTasksmain}
              setEdit={setSelectedTask}
            />
          )}
        </Sheet>
      </Modal>
      {isCompleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
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
                className="bg-blue-500 px-3 text-white rounded "
                onClick={handleCompleteModalSubmit}
                // disabled={!proofText}
                // className={`${
                //   !proofText
                //     ? "bg-gray-400 text-gray-600"
                //     : "bg-blue-500 text-white"
                // } rounded-md px-4 py-2 text-sm font-semibold`}
              >
                Submit
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

      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={!!viewselectedTask}
        onClose={() => setviewSelectedTask(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className=" bg-white rounded-lg lg-[min-500px] h-[640px] w-[350px] overflow-x-hidden ">
          {/* <ModalClose variant="plain" sx={{ m: 1 }} onClick={() => setOpen(false)} /> */}
          {viewselectedTask && (
            <ViewTask data={viewselectedTask} setOpen={setviewSelectedTask} />
          )}
        </div>
      </Modal>
    </div>
  );

  return (
    <div className="container mx-auto bg-gray-50 p-1 min-h-screen">
      <div className="flex gap-2 mb-6 p-2 w-full overflow-x-auto overflow-y-hidden">
        {["To Do", "In Progress", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`text-sm h-10 w-full px-3 py-2 rounded-[4px] 
          ${
            filter === status
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black border"
          } 
          hover:bg-blue-500 transition-colors whitespace-nowrap`}
            onClick={() => setFilter(status)}
            style={{
              lineHeight: "1.5rem",
              whiteSpace: "nowrap",
              height: "2.5rem",
            }}
          >
            <span>{statusMapping[status]}</span>{" "}
            {/* Use the mapping for display */}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-center text-blue-600 mt-4">
            No tasks found for the selected status.
          </p>
        )}
      </div>
    </div>
  );
}

export default MainTask;

import {

  Modal,
  ModalClose,
  Sheet,
} from "@mui/joy";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import EditTask from "./EditTask";
import ViewTask from "./ViewTask";


function MainTask() {
  const [allTasks, setAllTasks] = useState([]);
  const [filter, setFilter] = useState("To Do");
  const [edit, setEdit] = useState(false);
  const userDataString = localStorage.getItem("userData");
  const [userid, setUserid] = useState(
    JSON.parse(userDataString)?.userId || ""
  );
 

  const [open, setOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [viewselectedTask, setviewSelectedTask] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setUserid(userId);
    }
  }, []);
  const filterTasksByStatus = (tasks, status) =>
    tasks.filter(
      (task) => task.status === status || (status === "To Do" && !task.status)
    );

  useEffect(() => {
    if (userid) {
      fetchTasks();
    }
  }, [userid]);

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
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
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

      // Update the task status in the state
      setAllTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: updatedTask.status } : t
        )
      );

      console.log("Task updated:", updatedTask);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
//   useEffect(() => {
//     fetchTasks();
//   }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Utility function to truncate text
  const truncateText = (text, length) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
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
            onChange={(e) => handleStatusChange(task, e.target.value)} // Pass task and new status
          >
            <option value="" disabled>
              Change Status
            </option>
            <option value="">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Postponed</option>
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
              fetchTasks={fetchTasks}
              setEdit={setSelectedTask}
            />
          )}
        </Sheet>
      </Modal>
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

  const filteredTasks = filterTasksByStatus(allTasks, filter);
  const statusMapping = {
    "To Do": "To Do",
    "In Progress": "In Progress",
    Completed: "Completed",
    Cancelled: "Postponed", // Display "Postponed" but keep "Cancelled" in the code
  };

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

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import { Modal } from "@mui/joy";
import ViewTask from "../Task/ViewTask";

function Archive() {
  const { userData } = useContext(UserContext);
  const [userid, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [archiveTasks, setArchiveTasks] = useState([]);
  const [viewselectedTask, setviewSelectedTask] = useState(null);
  const [open, setOpen] = useState(false);
  const generateAddTaskLog = (taskId, to) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action: "changeStatus",
      userName: userData?.name,
      details: {
        fromStatus: "Archive",
        toStatus: to,
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

  const updateTaskStatus = async (id, status, body) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status, ...body }), // Include additional data in the body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      generateAddTaskLog(id, status);
      toast.dismiss();
      toast.success("Task Status Updated");
      return response.json();
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const fetchTasks = async (userId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tasks`
      );
      console.log("Response data:", response.data);

      const userTasks = response.data.filter((task) => {
        const isOwner = task.owner?.id === userId;
        const isPerson = task.people?.some(
          (person) => person.userId === userId
        );
        return isOwner || isPerson;
      });

      const ArchiveTasks = userTasks.filter(
        (task) => task.status === "Archive"
      );
      setArchiveTasks(ArchiveTasks);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setUserId(userId);
      fetchTasks(userId);
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleUnArchive = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is undefined");
      toast.error("Task ID is undefined");
      return;
    }

    try {
      console.log(`Updating task ${taskId} to Completed`);
      await updateTaskStatus(taskId, "Completed", {});
      fetchTasks(userid); // Re-fetch tasks after unarchiving
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text || ""; // Return an empty string if text is undefined
  };

  return (
    <div>
      {loading ? (
        <p className="flex justify-center items-center mt-20">
          <span className="loader"></span>
        </p>
      ) : archiveTasks &&
        Array.isArray(archiveTasks) &&
        archiveTasks.length > 0 ? (
        <div className="w-full max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archiveTasks.map((task, index) => (
              <div
                key={index}
                className="bg-white shadow-md cursor-pointer min:h-[38vh] rounded-lg p-4"
              >
                <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                  <div className="flex font-bold items-center gap-3 text-black text-sm">
                    <div className="flex">
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
                      {truncateText(task?.taskGroup?.groupName, 7)}
                    </div>
                    <span className="px-2 rounded-sm text-sm font-bold text-black bg-purple-400">
                      {task?.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      onClick={() => {
                        setviewSelectedTask(task);
                        setOpen(true);
                      }}
                      className="border p-2 rounded hover:bg-gray-300"
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
                    </div>
                    <button
                      className="border text-sm p-2 bg-green-500 rounded-[3px] hover:bg-green-600 text-white"
                      onClick={() => handleUnArchive(task._id)}
                    >
                      Unarchive
                    </button>
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
                      <div className=" bg-white rounded-lg lg-[min-500px] h-[500px]  overflow-x-hidden ">
                        {/* <ModalClose variant="plain" sx={{ m: 1 }} onClick={() => setOpen(false)} /> */}
                        {viewselectedTask && (
                          <ViewTask
                            data={viewselectedTask}
                            setOpen={setviewSelectedTask}
                          />
                        )}
                      </div>
                    </Modal>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {truncateText(task?.taskName, 15)}
                </h3>
                <div
                  className="bg-gray-100 p-2 text-sx rounded"
                  dangerouslySetInnerHTML={{
                    __html: truncateText(task?.description, 60),
                  }}
                />
                <div className="flex items-center justify-between text-[13px] font-bold text-gray-800 mb-2">
                  <span>
                    Date: {task?.startDate ? formatDate(task.startDate) : "N/A"}{" "}
                    - {task?.endDate ? formatDate(task.endDate) : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-3xl text-center mt-10">
          No Archive Task Available
        </div>
      )}
    </div>
  );
}

export default Archive;

import {
  Box,
  IconButton,
  Modal,
  ModalClose,
  ModalDialog,
  Skeleton,
} from "@mui/joy";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import EditApprovals from "./EditApprovals";
import AcceptApprovals from "./AcceptApprovals";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import ViewTask from "../Task/ViewTask";

function Approvals() {
  const { userData } = useContext(UserContext);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userid, setUserid] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewselectedTask, setviewSelectedTask] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/tasks"
      );
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getAllReleventTask = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/tasks/deptHead_projectLead/${userData?.userId}/all_approval_task`
      )
      .then((res) => {
        setLoading(false);
        setTasks(res.data.result);
      })
      .catch((err) => {
        setLoading(false);
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };

  useEffect(() => {
    if ([0].includes(userData?.userRole)) {
      fetchData();
    } else {
      getAllReleventTask();
    }
  }, []);

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setViewModalOpen(false);
    setSelectedTask(null);
    setviewSelectedTask(null);
    getAllReleventTask();
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      setUserid(userId);
    }
  }, []);

  const filteredTasks = (() => {
    switch (selectedStatus) {
      case "All":
        return tasks.filter((task) => task.status === "Completed");
      case "Approved":
        return tasks.filter((task) => task.category === "Approved");
      case "Unapproved":
        return tasks.filter((task) => task.category === "Unapproved");
      case "Archive Task":
        return tasks.filter((task) => task.status === "Archive");
      case "New Task Approval":
        return tasks.filter(
          (task) => task.status === "Cancelled" && task.owner.id === userid
        );
      default:
        return [];
    }
  })();

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const renderTable = () => {
    if (selectedStatus === "Archive Task") {
      return renderArchiveTask();
    } else if (selectedStatus === "New Task Approval") {
      return renderNewTaskApprovalTable();
    } else {
      return (
        <div className=" lg:rounded-lg rounded-[3px] overflow-hidden">
          <div className="relative w-full overflow-auto">
            {loading ? (
              <p className="flex justify-center items-center mt-20">
                <span className="loader"></span>
              </p>
            ) : (
              <table className="w-full border caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-gray-200">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                      Task
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                      Task Members
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                      Task Group
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                      Status
                    </th>
                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task, index) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                        {task?.taskName}
                      </td>
                      <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                        {task?.people.map((person) => person.name).join(", ")}
                      </td>
                      <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                        {task?.taskGroup?.groupName || "NIL"}
                      </td>
                      <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">
                        {task?.category === "Approved" && (
                          <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-900">
                            Approved
                          </div>
                        )}
                        {task?.category === "Unapproved" && (
                          <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-900">
                            Unapproved
                          </div>
                        )}
                        {!task?.category && (
                          <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-900">
                            Not Updated
                          </div>
                        )}
                      </td>
                      <td className="p-4 flex align-middle [&_:has([role=checkbox])]:pr-0 text-right">
                        <IconButton aria-label="View">
                          <button
                            onClick={() =>
                              handleViewTask({
                                taskName: "Example Task",
                                description: "This is an example task",
                                owner: { name: "John Doe" },
                                taskGroup: { groupName: "Group A" },
                                people: [
                                  { name: "Jane Doe" },
                                  { name: "Peter Pan" },
                                ],
                                startDate: "2024-03-08",
                                endDate: "2024-03-15",
                                status: "In Progress",
                              })
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="bi bi-eye"
                              viewBox="0 0 16 16"
                            >
                              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                          </button>
                        </IconButton>

                        <IconButton
                          onClick={() => handleEditClick(task)}
                          aria-label="Edit"
                        >
                          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
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
                              className="h-4 w-4"
                            >
                              <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"></path>
                            </svg>
                            <span className="sr-only">Edit</span>
                          </button>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      );
    }
  };

  const renderNewTaskApprovalTable = () => {
    return (
      <div className="border lg:rounded-lg rounded-[3px] overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-gray-200">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task Members
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task Group
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            {filteredTasks.map((task) => (
              <tbody key={task?._id} className="[&_tr:last-child]:border-0">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.taskName}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.people.map((person) => person.name).join(", ")}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.taskGroup.groupName}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">
                    {task.status === "Cancelled" && (
                      <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-90 ">
                        Unapproved
                      </div>
                    )}
                    {!task.status && (
                      <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-900  ">
                        Not Updated
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 text-right">
                    <IconButton
                      onClick={() => handleEditClick(task)}
                      aria-label="Approve"
                    >
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 bg-green-300 px-3">
                        Approve
                      </button>
                    </IconButton>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    );
  };

  const renderArchiveTask = () => {
    return (
      <div className="border lg:rounded-lg rounded-[3px] overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b bg-gray-200">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task Members
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Task Group
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Status
                </th>
              </tr>
            </thead>
            {filteredTasks.map((task) => (
              <tbody key={task?._id} className="[&_tr:last-child]:border-0">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.taskName}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.people.map((person) => person.name).join(", ")}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.taskGroup.groupName}
                  </td>
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">
                    {task.status === "Archive" && (
                      <div className="inline-flex w-fit items-center whitespace-nowrap rounded-md  border px-3.5 py-0.5 text-sm font-bold bg-red-500 text-gray-900 ">
                        Archive
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    );
  };
  console.log(viewselectedTask, "viewselectedTask");

  const handleViewTask = (task) => {
    setviewSelectedTask(task);
    setViewModalOpen(true);
  };
  return (
    <div>
      <header className="bg-gray-100 lg:rounded-lg rounded-[3px]  lg:px-4 px-2 flex items-center mb-2 justify-between">
        <div className="flex items-center gap-4 w-full">
          <div className="bg-blue-50 py-1 rounded-lg w-full">
            <div className="flex items-center gap-4 overflow-x-auto h-14 w-full">
              {[
                "All",
                "Approved",
                "Unapproved",
                "New Task Approval",
                "Archive Task",
              ].map((status) => (
                <button
                  key={status}
                  className={`inline-flex items-center justify-center text-black whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 lg:rounded-lg rounded-[3px] ${
                    selectedStatus === status
                      ? "bg-blue-500 text-white"
                      : "bg-blue-200"
                  }`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      {selectedStatus === "Archive Task" && renderArchiveTask()}
      {selectedStatus === "New Task Approval" && renderNewTaskApprovalTable()}
      {selectedStatus !== "Archive Task" &&
        selectedStatus !== "New Task Approval" &&
        renderTable()}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTask(null);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ModalDialog
          maxWidth={600}
          minWidth={300}
          style={{ height: "520px", overflow: "auto" }}
        >
          <ModalClose variant="plain" />
          {selectedTask && (
            <EditApprovals
              task={selectedTask}
              taskId={selectedTask?._id}
              onClose={handleCloseModal}
            />
          )}
        </ModalDialog>
      </Modal>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setviewSelectedTask(null);
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2
                  id="modal-title"
                  className="text-3xl font-bold text-gray-900"
                >
                  Group :{" "}
                  <span className="text-gray-500">
                    {viewselectedTask?.taskGroup?.groupName || "Loading..."}{" "}
                  </span>
                </h2>
                <button
                  onClick={() => {
                    setViewModalOpen(false);
                    setviewSelectedTask(null);
                  }}
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Task Details */}
              {viewselectedTask ? (
                <div
                  id="modal-desc"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-4 col-span-full">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Task Name
                      </h3>
                      <p className="text-xl font-semibold text-indigo-600">
                        {viewselectedTask.taskName}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {viewselectedTask.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Owner
                      </h3>
                      <p className="text-gray-700 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-500 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {viewselectedTask.owner?.name || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        People
                      </h3>
                      <ul className="list-none flex gap-3 items-center space-y-1">
                        {viewselectedTask.people?.map((person) => (
                          <li
                            key={person._id}
                            className="flex items-center text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-indigo-500 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {person.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Start Date
                        </h3>
                        <p className="text-gray-700 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {viewselectedTask.startDate || "Not set"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          End Date
                        </h3>
                        <p className="text-gray-700 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {viewselectedTask.endDate || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Status
                      </h3>
                      <span
                        className={`text-sm font-medium text-white px-3 py-1 rounded-full inline-flex items-center ${
                          viewselectedTask.status === "Completed"
                            ? "bg-green-500"
                            : viewselectedTask.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {viewselectedTask.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-700">Loading task details...</div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      ;
    </div>
  );
}

export default Approvals;

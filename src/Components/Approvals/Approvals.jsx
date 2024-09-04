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

function Approvals() {
  const {userData} = useContext(UserContext)
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userid, setUserid] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/tasks"
      );
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      // console.error("Error fetching tasks:", error); 
      setLoading(false);
    }
  };

  const getAllReleventTask = ()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/deptHead_projectLead/${userData?.userId}/all_approval_task`)
    .then((res)=>{
      setLoading(false)
      setTasks(res.data.result);
    }).catch((err)=>{
      setLoading(false)
      toast.dismiss()
      toast.error('Internal Server Error')
    })
  }
  

  useEffect(() => {
    // fetchData();
    if([0].includes(userData?.userRole)){
      fetchData();
    }
    else{
      getAllReleventTask();
    }
    
  }, []);

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTask(null);
    getAllReleventTask()
    // fetchData(); // Call fetchData function when modal is closed
  };

  useEffect(() => {
    // Retrieve userData from localStorage
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userDataObj = JSON.parse(userDataString);
      const userId = userDataObj.userId;
      // console.log(userId);
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
    setOpen(true);
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
                    {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                      Reminder
                    </th> */}
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
                      {/* <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                        {task?.reminder}
                      </td> */}
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
                      <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 text-right">
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
                        <Modal
                          aria-labelledby="modal-title"
                          aria-describedby="modal-desc"
                          open={open}
                          onClose={() => {
                            setOpen(false);
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
                {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Reminder
                </th> */}
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
                  {/* <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.reminder}
                  </td> */}
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
                      aria-label="Edit"
                    >
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 bg-green-300 px-3">
                        Approve
                      </button>
                    </IconButton>
                    <Modal
                      open={open}
                      onClose={() => {
                        setOpen(false);
                        setSelectedTask(null);
                      }}
                     
                    >
                      <ModalDialog
                        maxWidth={600}
                        minWidth={300}
                        className="bg-gray-200"
                      >
                        <ModalClose variant="plain" />
                        {selectedTask && (
                          <AcceptApprovals
                            task={selectedTask}
                            taskId={selectedTask?._id}
                            onClose={handleCloseModal}
                          />
                        )}
                      </ModalDialog>
                    </Modal>
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
                {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Reminder
                </th> */}
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                  Status
                </th>
                {/* <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0 text-right">
                                    Actions
                                </th> */}
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
                  {/* <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                    {task?.reminder}
                  </td> */}
                  <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">
                    {task.status === "Archive" && (
                      <div className="inline-flex w-fit items-center whitespace-nowrap rounded-md  border px-3.5 py-0.5 text-sm font-bold bg-red-500 text-gray-900 ">
                        Archive
                      </div>
                    )}
                  </td>
                  {/* <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 text-right">
                                        <IconButton onClick={() => handleEditClick(task)} aria-label="Edit">
                                            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 bg-green-300 px-3">

                                                Approve
                                            </button>
                                        </IconButton>
                                        <Modal
                                            aria-labelledby="modal-title"
                                            aria-describedby="modal-desc"
                                            open={open}
                                            onClose={() => { setOpen(false); setSelectedTask(null); }}
                                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: "#f0f0f0" }}
                                        >
                                            <ModalDialog maxWidth={600} minWidth={300} className='bg-gray-200'>
                                                <ModalClose variant="plain" />
                                                {selectedTask && <AcceptApprovals task={selectedTask} taskId={selectedTask?._id} onClose={handleCloseModal} />}
                                            </ModalDialog>
                                        </Modal>
                                    </td> */}
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    );
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
                // "Archive Task",
                "New Task Approval",
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

      {/* Render only the selected table */}
      {selectedStatus === "Archive Task" && renderArchiveTask()}
      {selectedStatus === "New Task Approval" && renderNewTaskApprovalTable()}
      {selectedStatus !== "Archive Task" &&
        selectedStatus !== "New Task Approval" &&
        renderTable()}
    </div>
  );
}

export default Approvals;

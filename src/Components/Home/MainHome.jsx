import { Avatar, Button, CircularProgress, IconButton, LinearProgress, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';



import { useNavigate } from 'react-router-dom';
import AddTask from '../Task/AddTask';
import Add from '@mui/icons-material/Add';
import CreateGroups from '../Group/CreateGroups';
import EditGroup from '../Group/EditGroup';
import { toast } from 'react-toastify';
function MainHome() {
    const [open, setOpen] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    // Set the thickness and size based on screen size
    const progressWidth = isSmallScreen ? '12px' : '24px';
    const progressSize = isSmallScreen ? '100px' : '180px';
    const [taskData, setTaskData] = useState("")
    const [groupData, setGroupData] = useState("")
    const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
    const [deletemodal, setDeletemodal] = useState(false); // State to manage modal visibility
    const [selectedGroup, setSelectedGroup] = useState(null); // State to store selected group data
    const [editedgroup, setEditedgroup] = useState(null); // State to store selected group data
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedGroup(null); // Reset selected group data when modal is closed
    };
    const createdAt = selectedGroup?.createdAt;

    const [groupIdToDelete, setGroupIdToDelete] = useState(null); // Add state to store the ID of the group to delete
    const handleClickDelete = (id) => {
        setGroupIdToDelete(id); // Set the groupIdToDelete state when the delete button is clicked
        console.log("Group ID to delete:", id); // Log the ID to verify if it's correctly set
        setDeletemodal(true); // Open the delete modal
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/delete/${groupIdToDelete}`);
            console.log(response.data);
            console.log("Delete Group with ID:", groupIdToDelete);
            // Handle success response, e.g., show a success message
            toast.success("Group deleted successfully!");
            setDeletemodal(false); // Close the delete modal
            // setInterval(() => {
            //     window.location.reload();
            // }, 2000);
            fetchGroupData();
        } catch (error) {
            console.error("Error deleting group:", error);
            // Handle error response, e.g., show an error message
            toast.error("Failed to delete group. Please try again later.");
        }
    };


    // Function to format date to YYYY-MM-DD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    // Function to handle opening the modal and setting selected group data
    const handleGroupClick = (task) => {
        setSelectedGroup(task);
        setOpenModal(true);
    };
    const handleEditGroup = (task) => {
        setEditedgroup(task);
        setEditModal(true);
    };
    const HandleGroupCreate = (task) => {
        setSelectedGroup(task);
        setOpenModal(true);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                setTaskData(response.data);

            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchData();


    }, []);


    const fetchGroupData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tgroups');
            setGroupData(response.data);
        } catch (error) {
            console.log("Error fetching Task: ", error);
        }
    };
    useEffect(() => {

        fetchGroupData();
    }, []);


    // console.log('taskData', taskData)
    // console.log('groupData', groupData)
    // console.log('taskData', taskData)


    return (
        <div>
            <div className="flex flex-col w-full min-h-screen bg-gray-100 rounded-lg">

                <main className="flex-1 p-2 md:p-8 grid gap-4 md:gap-4">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-4">
                        <div className="rounded-lg border bg-card  flex items-center justify-center shadow-sm" style={{ background: "#0A91D0" }} >
                            <div className="flex gap-9 items-center justify-center  px-3">
                                <div className="">
                                    <div className='flex items-center justify-center'>

                                        <h3 className="text-1xl lg:text-2xl font-semibold text-white text-center lg:text-start">
                                            Your today’s task is almost done!
                                        </h3>

                                    </div>
                                    <div className='flex items-center  justify-center'>

                                        <button onClick={() => navigate("/task")} className=" mt-5 w-full lg:w-[50%] h-full lg:h-14   text-black   rounded-md text-sm font-medium  px-2 py-2" style={{ background: "#EA791D" }}>
                                            View tasks
                                        </button>
                                    </div>
                                </div>
                                <div className='flex items-center  justify-center p-3'>
                                    <CircularProgress
                                        thickness={isSmallScreen ? 10 : 24}
                                        className="bg-gray-700"
                                        size="lg"
                                        sx={{
                                            color: "",
                                            '--CircularProgress-size': progressSize,
                                            '--LinearProgress-thickness': progressWidth,
                                        }}
                                        determinate
                                        value={70}
                                    >
                                        <Typography className="text-white text-lg">70%</Typography>
                                    </CircularProgress>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg border bg-card shadow-sm" style={{ background: "#0A91D0" }}>
                            <div className="p-6 text-black flex items-center justify-center  text-lg font-medium">
                                No tasks for today
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl text-black font-semibold">In Progress</h2>
                        <main class="flex flex-col gap-6  md:p-10">
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                                {Array.isArray(taskData) && taskData
                                    .filter(task => task.status === "In Progress") // Filter tasks with status "In Progress"
                                    .map(task => (
                                        <div key={task?.id} class="border bg-card text-card-foreground rounded-lg shadow-md">
                                            <div class="p-2">
                                                <div class="flex items-center justify-between">
                                                    <div>
                                                        <h3 class="text-lg text-black font-medium">{task?.taskGroup}</h3>
                                                    </div>
                                                    <div className="flex text-black items-center gap-2">
                                                        <span className="text-black flex items-center gap-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm" viewBox="0 0 16 16">
                                                            <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                            <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                        </svg> {task?.reminder}</span>
                                                    </div>
                                                </div>
                                                <div className='flex text-black items-center mt-2  gap-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                    </svg>
                                                    <div className=' text-black font-bold'>
                                                        {task && task.owner && task.owner.name}
                                                    </div>

                                                </div>
                                                <p class="text-gray-500 mt-2">{task?.taskName}</p>
                                                <div className=''>
                                                    <div className=' grid gap-2 mt-2'>
                                                        <p class="text-gray-500 bg-green-200 px-3 rounded-lg">{task?.category}</p>
                                                        {/* <p class="text-gray-500 bg-yellow-200 px-3 rounded-lg">{task?.status}</p> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}


                            </div>
                        </main>
                    </div>
                    <div className="grid ">
                        <div className='flex items-center justify-between  '>

                            <h2 className="text-xl text-black font-semibold">Task Groups</h2>
                            <div>
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    className='text-lg text-black '
                                    startDecorator={<Add className='text-black' />}
                                    onClick={() => setOpen(true)}
                                >
                                    Add Groups
                                </Button>
                            </div>
                            <Modal className="mt-14" open={open} onClose={() => setOpen(false)}>
                                <ModalDialog className=" px-5 max-w-md rounded-lg bg-white shadow-lg dark:bg-gray-900" minWidth={500} style={{ height: "580px", overflow: "auto" }} >

                                    <div onSubmit={() => setOpen(false)}>


                                        <ModalClose />




                                        <CreateGroups />

                                    </div>
                                </ModalDialog>
                            </Modal>
                        </div>
                        <div className="  border mt-4 rounded-lg" >
                            <div style={{ minWidth: "100%", display: "table" }}>
                                <div className="p-4 space-y-4">
                                    {Array.isArray(groupData) && groupData.map(task => (


                                        <div key={task?.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                    <Avatar className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 " src={task?.profilePic} />
                                                </span>
                                                <div>
                                                    <h4 className=" text-black font-medium">{task?.groupName}</h4>
                                                    {/* <p className="text-gray-500 text-black text-sm">Project Manager</p> */}
                                                </div>
                                            </div>
                                            <div className='gap-3 flex '>

                                                <Button onClick={() => handleGroupClick(task)} variant="outlined" color="neutral" className="items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                    </svg>
                                                </Button>
                                                <Modal open={openModal} onClose={handleCloseModal}>
                                                    <ModalDialog className="bg-gray-200 mt-10 " maxWidth={500} minWidth={700} style={{ overflow: "auto" }}>
                                                        <ModalClose />
                                                        <form onSubmit={handleCloseModal}>
                                                            {selectedGroup && (
                                                                <div>

                                                                    <main class="w-full max-w-5xl mx-auto px-4 py-6   border ">
                                                                        <div class="grid  gap-6 md:gap-6 lg:gap-8">
                                                                            <div class="grid gap-2">
                                                                                <div className='flex gap-5 items-end'>

                                                                                    <Avatar className="flex items-center justify-center  rounded-full border text-black bg-gray-100 " src={selectedGroup?.profilePic} />

                                                                                    <h1 class="text-4xl font-bold ">{selectedGroup?.groupName}</h1>
                                                                                    <div class="flex items-center gap-4 text-gray-600 text-bold ">
                                                                                        <span>{createdAt ? formatDate(createdAt) : ''}</span>

                                                                                        {/* <span>Managed by John Doe</span> */}

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 class="text-2xl font-bold  mb-4">Department Head</h2>
                                                                                <div class="flex flex-wrap gap-2">
                                                                                    <span> <strong></strong>

                                                                                        {selectedGroup?.deptHead.map((person, index) => (
                                                                                            <span
                                                                                                key={index}
                                                                                                className={`inline-block  py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'
                                                                                                    }`}
                                                                                            >
                                                                                                {person.name}
                                                                                            </span>
                                                                                        ))}

                                                                                    </span>



                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 class="text-2xl font-bold  mb-4">Members</h2>
                                                                                <div class="flex flex-wrap gap-2">
                                                                                    <div className="text-white  py-1 rounded-full text-sm font-medium">
                                                                                        {selectedGroup?.members.map((person, index) => (
                                                                                            <span
                                                                                                key={index}
                                                                                                className={`inline-block px-2 py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                                                                                    }`}
                                                                                            >
                                                                                                {person.name}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>



                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 class="text-2xl font-bold  mb-4">Project Lead</h2>
                                                                                <div class="flex items-center font-bold gap-4">
                                                                                    <span class="     " style={{ fontWeight: "bold" }}>
                                                                                        {selectedGroup?.projectLead.map((person, index) => (
                                                                                            <span
                                                                                                key={index}
                                                                                                className={`inline-block px-2 py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                                                                                    }`}
                                                                                            >
                                                                                                {person.name}
                                                                                            </span>
                                                                                        ))}


                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </main>
                                                                </div>
                                                            )}
                                                        </form>
                                                    </ModalDialog>
                                                </Modal>
                                                <Button onClick={() => handleEditGroup(task)} variant="outlined"
                                                    color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>
                                                </Button>
                                                <Modal className="mt-14" open={EditModal} onClose={() => setEditModal(false)}>
                                                    <ModalDialog className="" minWidth={500} style={{ height: "600px", overflow: "auto" }} >

                                                        <ModalClose />
                                                        <div onSubmit={() => setEditModal(false)}>
                                                            {editedgroup && (
                                                                <EditGroup Editid = {editedgroup?._id} />
                                                            )}
                                                        </div>
                                                    </ModalDialog>
                                                </Modal>
                                                <Button variant="outlined"
                                                    onClick={() => handleClickDelete(task?._id)}
                                                    color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </Button>
                                                <Modal className="mt-14" open={deletemodal} onClose={() => setDeletemodal(false)}>
                                                    <ModalDialog className="" minWidth={300} style={{ height: "200px" }}>
                                                        <ModalClose />
                                                        <div> {/* Call handleDelete function when the form is submitted */}

                                                            <div className='p-3 mt-2'>
                                                                <h1 className='text-lg font-bold '>Are you sure <br /> you want to delete this Group?</h1>
                                                                <div class="flex justify-between gap-2 mt-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDeletemodal(false)} // Close the modal without deleting
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:bg-yellow-200 h-10 px-4 py-2"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={handleDelete}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-800 h-10 px-4 py-2"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ModalDialog>
                                                </Modal>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default MainHome

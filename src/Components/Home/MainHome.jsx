import { AspectRatio, Avatar, Box, Button, CircularProgress, IconButton, LinearProgress, Modal, ModalClose, ModalDialog, Option, Select, Skeleton, Typography } from '@mui/joy'
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



const DateComponent = ({ taskData }) => {
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day} ${month}`;
    };

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    const formatISODate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const startDate = new Date(taskData?.startDate);
    const endDate = new Date(taskData?.endDate);

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const isStartDateValid = isValidDate(startDate);
    const isEndDateValid = isValidDate(endDate);

    const formattedDefaultDate = isStartDateValid && isEndDateValid
        ? `${formatDate(startDate)} - ${formatDate(endDate)}`
        : null;

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const formatDatee = (dateString) => {
        if (!dateString) return ''; // If no date, return empty string
        try {
            if (dateString.includes('/')) {
                const [day, month] = dateString.split('/');
                return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}`;
            } else {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    console.error('Invalid date string:', dateString);
                    return 'Invalid Date';
                }
                const day = date.getDate();
                const month = date.getMonth();
                return `${monthNames[month]} ${day}`;
            }
        } catch (error) {
            console.error('Error while formatting date:', error);
            return 'Invalid Date';
        }
    };


    const formatStartDate = formatDatee(taskData?.startDate);
    const formatEndDate = formatDatee(taskData?.endDate);

    console.log("Formatted Start Date:", formatStartDate);
    console.log("Formatted End Date:", formatEndDate);

    return (
        <div className='flex font-semibold text-[11px]'>
            <p>{formatStartDate} - {formatEndDate}</p>
            <p></p>
        </div>
    );
};




function MainHome() {
    const [open, setOpen] = useState(false);
    const [EditModal, setEditModal] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const progressWidth = isSmallScreen ? '12px' : '24px';
    const progressSize = isSmallScreen ? '120px' : '180px';
    const [taskData, setTaskData] = useState("");
    const [userid, setuserid] = useState("")
    const [userData, setUserData] = useState("")
    const [loading, setLoading] = React.useState(true);
    const [groupData, setGroupData] = useState("")
    const [openModal, setOpenModal] = useState(false); // State to manage modal visibility
    const [deletemodal, setDeletemodal] = useState(false); // State to manage modal visibility
    const [selectedGroup, setSelectedGroup] = useState(null); // State to store selected group data
    const [editedgroup, setEditedgroup] = useState(null); // State to store selected group data
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedGroup(null); // Reset selected group data when modal is closed
    };


    const handleDelete = async () => {
        if (!groupIdToDelete) {
            toast.error("Group ID is required to delete a group");
            return;
        }

        try {
            const response = await axios.delete(`https://ptb.insideoutprojects.in/api/deletegroup/${groupIdToDelete}`);
            console.log(response.data);
            console.log("Delete Group with ID:", groupIdToDelete);
            // Handle success response, e.g., show a success message
            toast.success("Group deleted successfully!");
            setDeletemodal(false); // Close the delete modal
            fetchGroupData(); // Refresh group data
        } catch (error) {
            console.error("Error deleting group:", error);
            // Handle error response, e.g., show an error message
            toast.error("Failed to delete group. Please try again later.");
        }
    };
    // Function to format date to YYYY-MM-DD

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
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setuserid(userId);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://ptb.insideoutprojects.in/api/tasks');
                const filteredTasks = response.data.filter(task => {
                    // Check if any of the people in the task match the user's ID
                    return task.people.some(person => person.userId === userid);
                });
                // const filteredTasks = response.data.filter(task => task.people.id === userid);
                setTaskData(filteredTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        if (userid) {
            fetchData();
        }
    }, [userid]);


    const calculateCompletionPercentage = () => {
        if (taskData.length === 0) return 0;

        const completedTasks = taskData.filter(task => task.status === 'Completed');
        const completionPercentage = (completedTasks.length / taskData.length) * 100;

        return completionPercentage;
    };

    const completionPercentage = calculateCompletionPercentage();

    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`https://ptb.insideoutprojects.in/api/groups`);
            setGroupData(response.data);
        } catch (error) {
            console.log("Error fetching Group Data: ", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://ptb.insideoutprojects.in/api/userData');
            setUserData(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching Group Data: ", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Find the current user based on the frontendUserId
    const currentUser = Array.isArray(userData) && userData.find(user => user.userId === userid);

    // Check if the current user has userRole 0, 1, or 2
    const showButton = currentUser && (currentUser.userRole === 0 || currentUser.userRole === 1 || currentUser.userRole === 2);

    useEffect(() => {
        if (userid) {
            fetchGroupData();
        }
    }, [userid]);




    const spacing = 1;

    const color1 = '#EF7F1A4D';
    const color2 = '#0A91D04D';

    // Define the randomColor object as a function
    const randomColor = {
        marginRight: spacing + 'em',
        get backgroundColor() {
            const randomNumber = Math.random();
            return randomNumber < 0.5 ? color1 : color2;
        },
    };
















    return (
        <div>


            <div className="flex flex-col w-full min-h-screen bg-gray-100 rounded-lg">

                <main className="flex-1 p-2 md:p-8 grid gap-4 md:gap-4">
                    <div className=" gap-4 md:gap-4">
                        <div className="rounded-lg border bg-card    shadow-sm" style={{ background: "#0A91D0" }} >
                            <div className="flex gap-9 items-center justify-between lg:justify-center  p-8">
                                <div className="">
                                    <div className='flex items-center justify-center'>

                                        <h3 className="text-1xl lg:text-5xl font-semibold text-white text-center lg:text-start">
                                            Your today’s task is almost done!
                                        </h3>

                                    </div>
                                    <div className='flex items-center lg:m-3  justify-center'>

                                        <button onClick={() => navigate("/task")} className=" mt-5 w-full lg:w-[50%] h-full lg:h-14   text-black lg:text-lg   rounded-md text-sm font-medium  px-2 py-2" style={{ background: "#EA791D" }}>
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
                                        value={completionPercentage.toFixed(2)}
                                    >
                                        <Typography className="text-white text-lg">{completionPercentage.toFixed(2)}%</Typography>
                                    </CircularProgress>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div>
                        <h2 className="text-xl text-black font-semibold mb-2">In Progress</h2>
                        <main class="flex flex-col gap-6 justify-center  mt-6 mb-6">
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">

                                {Array.isArray(taskData) ? (
                                    taskData
                                        .filter(task => task.status === "In Progress")
                                        .map(task => (
                                            <div onClick={() => navigate("/task")} key={task?.id} class="border cursor-pointer bg-card text-card-foreground w-full rounded-lg shadow-md" style={randomColor}>
                                                <div class="p-2 h-[150px]">
                                                    <div class="flex items-center justify-between">
                                                        <div>
                                                            <h3 class="text-lg text-black font-medium">{task?.taskGroup}</h3>
                                                        </div>
                                                        <div className="flex text-black items-center gap-2">
                                                            <span className="flex items-center gap-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm" viewBox="0 0 16 16">
                                                                    <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                                    <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                                </svg> {task?.reminder}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p class="text-gray-500 px-2 font-bold mt-3">{task?.taskName}</p>
                                                    <div className='flex items-center gap-2 justify-between px-2 rounded-lg mt-3'>
                                                        <div className='flex items-center gap-2 text-black bg-yellow-200 justify-start px-2 rounded-sm font-bold mt-2'>
                                                            <div className=''>
                                                                {task?.status}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className='text-sm mt-2 flex gap-1 bg-white text-black border px-1 rounded'>
                                                                <svg width="20px" height="20px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
                                                                    <defs></defs>
                                                                    <title>alarm</title>
                                                                    <path d="M16,28A11,11,0,1,1,27,17,11,11,0,0,1,16,28ZM16,8a9,9,0,1,0,9,9A9,9,0,0,0,16,8Z" />
                                                                    <polygon points="18.59 21 15 17.41 15 11 17 11 17 16.58 20 19.59 18.59 21" />
                                                                    <rect fill="#000000" x="3.96" y="5.5" width="5.07" height="2" transform="translate(-2.69 6.51) rotate(-45.06)" />
                                                                    <rect fill="#000000" x="24.5" y="3.96" width="2" height="5.07" transform="translate(2.86 19.91) rotate(-44.94)" />
                                                                    <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" fill="none" width="32" height="32" />
                                                                </svg>
                                                                <div>
                                                                    <div>
                                                                        <DateComponent taskData={task} />
                                                                    </div>
                                                                </div>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className=''>
                                        {Array.from(new Array(1)).map((_, index) => (
                                            <div className='grid grid-cols-1 '>
                                                <Box sx={{ m: 'auto' }}>
                                                    <AspectRatio variant="plain" sx={{ width: 300 }}>
                                                        <Skeleton loading={loading}>
                                                            <img
                                                                src={
                                                                    loading
                                                                        ? 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                                                                        : 'https://images.unsplash.com/photo-1686548812883-9d3777f4c137?h=400&fit=crop&auto=format&dpr=2'
                                                                }
                                                                alt=""
                                                            /> 
                                                        </Skeleton>
                                                    </AspectRatio>
                                                </Box>
                                            </div>
                                        ))}
                                    </div>
                                )}



                            </div>
                        </main>
                    </div>
                    <div className="grid ">
                        <div className='flex items-center justify-between'>
                            <h2 className="text-xl text-black font-semibold">Task Groups</h2>
                            <div className='ml-auto'>
                                {showButton && (
                                    <Button
                                        variant="outlined"
                                        color="neutral"
                                        className='text-lg text-black'
                                        startDecorator={<Add className='text-black' />}
                                        onClick={() => setOpen(true)}
                                    >
                                        Add Groups
                                    </Button>
                                )}
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
                                    {Array.isArray(groupData) && groupData.map((task, index) => (


                                        <div key={index} className="flex items-center justify-between">
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

                                                <Button
                                                    onClick={() => handleGroupClick(task)}
                                                    variant="outlined"
                                                    color="neutral"
                                                    className="items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                    </svg>
                                                </Button>

                                                <Modal open={openModal} onClose={handleCloseModal}>
                                                    <ModalDialog className="bg-gray-200 mt-10" maxWidth={500} minWidth={700} style={{ overflow: "auto" }}>
                                                        <ModalClose />
                                                        <form onSubmit={handleCloseModal}>
                                                            {selectedGroup && (
                                                                <div>
                                                                    <main className="w-full max-w-5xl mx-auto px-4 py-6 border">
                                                                        <div className="grid gap-6 md:gap-6 lg:gap-8">
                                                                            <div className="grid gap-2">
                                                                                <div className='flex gap-5 items-end'>
                                                                                    <Avatar className="flex items-center justify-center rounded-full border text-black bg-gray-100" src={selectedGroup?.profilePic} />
                                                                                    <h1 className="text-4xl font-bold">{selectedGroup?.groupName}</h1>
                                                                                    <div className="flex items-center gap-4 text-gray-600 text-bold">
                                                                                        {/* <span>{createdAt ? formatDate(createdAt) : ''}</span> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 className="text-2xl font-bold mb-4">Department Head</h2>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    <span>
                                                                                        {selectedGroup?.deptHead?.length ? (
                                                                                            selectedGroup.deptHead.map((person, index) => (
                                                                                                person ? (
                                                                                                    <span
                                                                                                        key={index}
                                                                                                        className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'}`}
                                                                                                    >
                                                                                                        {person.name}
                                                                                                    </span>
                                                                                                ) : null
                                                                                            ))
                                                                                        ) : (
                                                                                            <span>No department heads available.</span>
                                                                                        )}
                                                                                    </span>

                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 className="text-2xl font-bold mb-4">Members</h2>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    <div className="text-white py-1 rounded-full text-sm font-medium">
                                                                                        {selectedGroup?.members?.map((person, index) => (
                                                                                            <span
                                                                                                key={index}
                                                                                                className={`inline-block px-2 py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
                                                                                            >
                                                                                                {person.name}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <h2 className="text-2xl font-bold mb-4">Project Lead</h2>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    <span>
                                                                                        {selectedGroup?.projectLead?.length ? (
                                                                                            selectedGroup.projectLead.map((person, index) => (
                                                                                                person ? (
                                                                                                    <span
                                                                                                        key={index}
                                                                                                        className={`inline-block py-1 rounded-full mr-2 px-4 mb-2 ${index % 2 === 0 ? 'bg-yellow-500 text-white' : 'bg-purple-500 text-white'}`}
                                                                                                    >
                                                                                                        {person.name}
                                                                                                    </span>
                                                                                                ) : null
                                                                                            ))
                                                                                        ) : (
                                                                                            <span>No department heads available.</span>
                                                                                        )}
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
                                                {showButton && (
                                                    <Button onClick={() => handleEditGroup(task)} variant="outlined"
                                                        color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                        </svg>
                                                    </Button>
                                                )}
                                                <Modal className="mt-14" open={EditModal} onClose={() => setEditModal(false)}>
                                                    <ModalDialog className="" minWidth={500} style={{ height: "600px", overflow: "auto" }} >

                                                        <ModalClose />
                                                        <div onSubmit={() => setEditModal(false)}>
                                                            {editedgroup && (
                                                                <EditGroup Editid={editedgroup?._id} />
                                                            )}
                                                        </div>
                                                    </ModalDialog>
                                                </Modal>
                                                {/* {showButton && (
                                                <Button variant="outlined"
                                                    onClick={() => handleClickDelete(task?._id)}
                                                    color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </Button>)} */}
                                                <Modal className="mt-14" open={deletemodal} onClose={() => setDeletemodal(false)}>
                                                    <ModalDialog className="" minWidth={300} style={{ height: "200px" }}>
                                                        <ModalClose />
                                                        <div> {/* Call handleDelete function when the form is submitted */}

                                                            <div className='p-3 mt-2'>
                                                                <h1 className='text-lg font-bold w-[400px] '>You are about to delete a group which has active and unapproved tasks. Are you sure you want to delete all data?</h1>
                                                                <div class="flex justify-between gap-2 mt-6">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setDeletemodal(false)} // Close the modal without deleting
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:bg-yellow-200 h-10 px-4 py-2"
                                                                    >
                                                                        No, keep my data
                                                                    </button>
                                                                    <button
                                                                        onClick={handleDelete}
                                                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-800 h-10 px-4 py-2"
                                                                    >
                                                                        Yes, delete group
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
            </div >
        </div >
    )
}

export default MainHome

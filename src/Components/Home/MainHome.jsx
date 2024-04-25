import { Avatar, Button, CircularProgress, IconButton, LinearProgress, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function MainHome() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    // Set the thickness and size based on screen size
    const progressWidth = isSmallScreen ? '12px' : '24px';
    const progressSize = isSmallScreen ? '100px' : '180px';
    const [taskData, setTaskData] = useState("")
    const [groupData, setGroupData] = useState("")

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

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tgroups');
                setGroupData(response.data);
            } catch (error) {
                console.log("Error fetching Task: ", error);
            }
        };

        fetchGroupData();
    }, []);


    console.log('taskData', taskData)


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

                                {Array.isArray(taskData) && taskData.map(task => (
                                    <div key={task?.id} class="border bg-card text-card-foreground rounded-lg shadow-md" >
                                        <div class="p-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <h3 class="text-lg font-medium">{task?.taskGroup}</h3>
                                                    {/* <p class="text-gray-500"> dangerouslySetInnerHTML={{ __html: task?.description }}</p> */}

                                                    <p class="text-gray-500  mt-2">{task?.taskName}</p>
                                                </div>

                                            </div>
                                            <div className='p-3'>
                                                <div className='flex gap-2 mt-2'>
                                                    <p class="text-gray-500 bg-green-200 px-1 rounded-lg">{task?.category}</p>
                                                    <p class="text-gray-500 bg-yellow-200 px-1 rounded-lg">{task?.category}</p>

                                                </div>
                                                {/* <LinearProgress color='neutral' determinate value={85} /> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </main>
                    </div>
                    <div className="grid ">
                        <h2 className="text-xl text-black font-semibold">Task Groups</h2>
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

                                                <IconButton variant="outlined"
                                                    color="neutral" className="  items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                    </svg>
                                                </IconButton>
                                                <Button variant="outlined"
                                                    color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                    </svg>
                                                </Button>
                                                <Button variant="outlined"
                                                    color="neutral" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </Button>
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

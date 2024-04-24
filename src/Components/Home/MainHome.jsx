import { CircularProgress, LinearProgress, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
function MainHome() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Set the thickness and size based on screen size
    const progressWidth = isSmallScreen ? '12px' : '24px';
    const progressSize = isSmallScreen ? '100px' : '180px';
    const [taskData, setTaskData] = useState("")

useEffect(() =>{
    const fetchData = async()=>{
        try{
            const response = await axios.get('http://localhost:5000/api/tasks');
            setTaskData(response.data);
        }catch (error){
            console.log("Error fetching Task  ",error)

        }
    };
    fetchData();
},[]);




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

                                        <button className=" mt-5 w-full lg:w-[50%] h-full lg:h-14   text-black   rounded-md text-sm font-medium  px-2 py-2" style={{ background: "#EA791D" }}>
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
                                <div class="border bg-card text-card-foreground rounded-lg shadow-md" >
                                    <div class="p-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="text-lg font-medium">Finish design mockups</h3>
                                                <p class="text-gray-500">Complete the high-fidelity designs for the new homepage.</p>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-6 w-6 text-gray-500"
                                            >
                                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                            </svg>
                                        </div>
                                        <div className='p-3'>

                                            <LinearProgress color='neutral' determinate value={85} />
                                        </div>
                                    </div>
                                </div>
                                <div class="border text-card-foreground rounded-lg shadow-md bg-[#f0f9ff]" data-v0-t="card">
                                    <div class="p-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="text-lg font-medium">Implement new features</h3>
                                                <p class="text-gray-500">Add the shopping cart and checkout functionality.</p>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-6 w-6 text-gray-500"
                                            >
                                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                            </svg>
                                        </div>

                                        <div className='p-3'>

                                            <LinearProgress color='danger' determinate value={85} />
                                        </div>

                                    </div>
                                </div>
                                <div class="border text-card-foreground rounded-lg shadow-md bg-[#f4f4ff]" data-v0-t="card">
                                    <div class="p-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="text-lg font-medium">Write blog post</h3>
                                                <p class="text-gray-500">Publish a new blog post about the latest product updates.</p>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-6 w-6 text-gray-500"
                                            >
                                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                            </svg>
                                        </div>
                                        <div className='p-3'>

                                            <LinearProgress color='neutral' determinate value={85} />
                                        </div>
                                    </div>
                                </div>
                                <div class="border text-card-foreground rounded-lg shadow-md bg-[#fff0f0]" data-v0-t="card">
                                    <div class="p-4">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <h3 class="text-lg font-medium">Refactor codebase</h3>
                                                <p class="text-gray-500">Improve the code structure and optimize performance.</p>
                                            </div>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-6 w-6 text-gray-500"
                                            >
                                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                            </svg>
                                        </div>
                                        <div className='p-3'>

                                            <LinearProgress determinate value={65} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div className="grid ">
                        <h2 className="text-xl text-black font-semibold">Task Groups</h2>
                        <div className="  border mt-4 rounded-lg" >
                            <div style={{ minWidth: "100%", display: "table" }}>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                <span className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 ">JD</span>
                                            </span>
                                            <div>
                                                <h4 className=" text-black font-medium">John Doe</h4>
                                                <p className="text-gray-500 text-black text-sm">Project Manager</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                            View
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                <span className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 ">BJ</span>
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-black">Bob Johnson</h4>
                                                <p className="text-gray-500  text-sm">Developer</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                            View
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                <span className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 ">JS</span>
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-black">Jane Smith</h4>
                                                <p className="text-gray-500  text-sm">Designer</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                            View
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                <span className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 ">BJ</span>
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-black">Bob Johnson</h4>
                                                <p className="text-gray-500  text-sm">Developer</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                            View
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="relative flex-shrink-0 overflow-hidden rounded-full h-10 w-10">
                                                <span className="flex items-center justify-center h-full w-full rounded-full border text-black bg-gray-200 ">BJ</span>
                                            </span>
                                            <div>
                                                <h4 className="font-medium text-black">Bob Johnson</h4>
                                                <p className="text-gray-500  text-sm">Developer</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 text-black hover:bg-primary/90 h-10 px-4 py-2">
                                            View
                                        </button>
                                    </div>

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

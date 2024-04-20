import { CircularProgress, Typography } from '@mui/joy'
import React from 'react'

function MainHome() {
    return (
        <div>
            <div className="flex flex-col w-full min-h-screen bg-gray-100 rounded-lg">

                <main className="flex-1 p-4 md:p-8 grid gap-4 md:gap-8">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                        <div className="rounded-lg border bg-card  flex items-center justify-center shadow-sm" style={{ background: "#0A91D0" }} >
                            <div className="flex gap-9 items-center justify-center  p-6">
                                <div className="">
                                    <div className='flex items-center justify-center'>

                                        <h3 className=" text-5xl font-semibold text-black  text-start ">Your today’s task
                                            is almost done!</h3>
                                    </div>
                                    <div className='flex items-center justify-center'>

                                        <button className=" mt-6 w-[50%] h-14   text-black   rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none   hover:bg-primary/90 h-10 px-4 py-2" style={{ background: "#EA791D" }}>
                                            View tasks
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <CircularProgress size="lg" sx={{ '--CircularProgress-size': '180px' }} determinate value={70}  >
                                        <Typography className="text-black">70%</Typography>
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
                    <div className="grid ">
                        <h2 className="text-xl text-black font-semibold">Project Groups</h2>
                        <div data-radix-scroll-area-viewport="" className=" h-full w-full border rounded-lg" style={{ overflow: "hidden", marginTop: "-60px" }}>
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

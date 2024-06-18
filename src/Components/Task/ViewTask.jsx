import { Avatar, Chip } from '@mui/joy'
import React from 'react'

function ViewTask({ data, status }) {
    console.log("status", status)
    console.log("task", data)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };
    const contentStyle = {
        padding: '1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
    };

    const pStyle = {
        margin: '0 0 1em',
    };

    const listStyle = {
        margin: '0 0 1em 1.5em',
        padding: '0',
    };

    const listItemStyle = {
        margin: '0.5em 0',
    };

    const italicStyle = {
        fontStyle: 'italic', 
    };
    const setInlineStyles = (html) => {
        return html.replace(/<p>/g, `<p style="margin: 0 0 1em;">`)
            .replace(/<ol>/g, `<ol style="margin: 0 0 1em 1.5em; padding: 0;">`)
            .replace(/<ul>/g, `<ul style="margin: 0 0 1em 1.5em; padding: 0;">`)
            .replace(/<li>/g, `<li style="margin: 0.5em 0;">`)
            .replace(/<i>/g, `<i style="font-style: italic;">`)
            .replace(/<em>/g, `<em style="font-style: italic;">`);
    };
    return (
        <div>
            <div class="container mx-auto   p-0 ">
                <div class=" rounded-lg  p-2 py-6 lg:px-8">
                    <div class="flex items-center justify-between mb-6">
                        <h1 class="text-2xl font-bold text-gray-900 ">{data?.taskGroup.groupName}</h1>

                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 class="text-lg font-medium text-gray-900  mb-2">Task Name</h2>
                            <p class="  ">
                                {data?.taskName}
                            </p>

                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-900  mb-2">Task Description</h2>
                            <div
                                className="bg-gray-100 p-4 rounded"
                                style={contentStyle}
                                dangerouslySetInnerHTML={{ __html: data?.description }}
                            />
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900  mb-2">Audio Player</h2>
                            <audio controls>
                                <source src={data?.audioFile} type="audio/mp4" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>


                        <div>
                            <h2 className="text-lg font-medium text-gray-900  mb-2">PDF Viewer</h2>
                            {data && data.pdfFile && (
                                <a
                                    href={data.pdfFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                >
                                    <span>{data.pdfFile.split('\\').pop()}</span> {/* Displaying file name */}
                                </a>
                            )}
                        </div>




                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-gray-900  mb-2">Assigned By</h2>
                            <p className="text-gray-700 mb-2 gap-2 flex  ">
                                <p class="font-bold  bg-yellow-500 px-2 rounded-sm text-black"> {data?.owner?.name}</p>
                            </p>

                        </div>
                        <div>
                            <h2 class="text-lg font-medium text-gray-900  mb-2">Assigned To</h2>
                            <div className='flex '>

                                <p class="font-bold  bg-green-500 text-black  px-2 rounded-sm"> {data?.people.map(person => person.name).join(', ')}</p>
                            </div>
                        </div>


                    </div>
                    {/* <div class="mb-6">
                        <h2 class="text-lg font-medium text-gray-900  mb-2">Comments</h2>
                        <div class="bg-gray-100  rounded-lg p-4">
                            <textarea
                                class="w-full bg-transparent text-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
                                rows="3"
                                placeholder="Add a comment..."
                            ></textarea>
                            <div class="flex justify-end mt-2">
                                <button class="px-4 py-2 rounded-md text-sm font-medium text-white  bg-black-200  hover:bg-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ">
                                    Add Comment
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-100  rounded-lg p-6 mb-6">
                        <h2 class="text-lg font-medium text-gray-900  mb-4">Comment History</h2>
                        <div class="space-y-4">
                            <div class="flex items-start space-x-4">
                                <div class="flex-shrink-0">
                                    <Avatar src="/placeholder.svg" alt="User Avatar" class="w-10 h-10 rounded-full" />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-lg font-medium text-gray-900 ">John Doe</h3>
                                    <p class="text-gray-700 ">
                                        Great work on the website redesign! I love the new layout and color scheme.
                                    </p>
                                    <div class="flex items-center space-x-2 mt-2">
                                        <span class="text-xs text-gray-500 ">2 days ago</span>
                                        <button class="px-2 py-1 rounded-md text-xs font-medium text-white  bg-gray-200  hover:bg-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-start space-x-4">
                                <div class="flex-shrink-0">
                                    <Avatar src="/placeholder.svg" alt="User Avatar" class="w-10 h-10 rounded-full" />
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-lg font-medium text-gray-900 ">Jane Smith</h3>
                                    <p class="text-gray-700 ">
                                        I have a few suggestions for the homepage layout. Can we schedule a meeting to discuss?
                                    </p>
                                    <div class="flex items-center space-x-2 mt-2">
                                        <span class="text-xs text-gray-500 ">1 week ago</span>
                                        <button class="px-2 py-1 rounded-md text-xs font-medium text-white  bg-gray-200  hover:bg-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 class="text-lg font-medium text-gray-900  mb-2">Reminder</h2>
                            <div class="flex items-center space-x-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-black-900 flex text-black items-center gap-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm" viewBox="0 0 16 16">
                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                    </svg> {data?.reminder}</span>
                                </div>

                            </div>
                        </div><div>
                            <h2 className="text-lg font-medium text-gray-900  mb-2">Dates</h2>
                            <p className="text-gray-700 mb-2 gap-2 flex  ">
                                Start:<p className='border px-2 font-bold  rounded bg-gray-200'>
                                    {data?.startDate ? formatDate(data.startDate) : 'N/A'}
                                </p>
                            </p>
                            <p className="text-gray-700 flex gap-2 ">

                                End : <p style={{ marginLeft: "2px" }} className='border  px-2 font-bold rounded bg-gray-200'>
                                    {data?.endDate ? formatDate(data.endDate) : 'N/A'}
                                </p>
                            </p>
                        </div>
                    </div>
                    <div className='text-black'>
                        <div >
                            {status}

                        </div>
                    </div>






                </div>

            </div>
        </div>
    )
}

export default ViewTask

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../global/UserContext';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import moment from 'moment';
import Logs from '../logs/Logs';

function ViewTask({ data, status,setOpen }) {
    // console.log("status", status)
    // console.log("task", data)
    const [subTasks, setSubTasks] = useState([]);
    const { userData } = useContext(UserContext);
    const [userTasks, setUserTasks] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState(new Set()); // Track expanded tasks
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [newSubTask, setNewSubTask] = useState({ subTaskName: '', description: '' });
    const [selectedOption, setSelectedOption] = useState('all');
    const [filterUserTasks, setFilterUserTasks] = useState([]);
    const [loader, setLoader] = useState(false);
    const [logs, setLogs] = useState([]);

    const getAllUserSubTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/${data?._id}/task/${userData?.userId}/user_tasks`)
            .then((res) => {
                setSubTasks(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    const getAllLogs = ()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/logs/${data?._id}`)
        .then((res) => {
            setLogs(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    useEffect(() => {
        getAllLogs();
    }, []);


    const getAllUserTasks = () => {
        setLoader(true)
        axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/assigned/${userData?.userId}`)
            .then((res) => {
                setUserTasks(res.data);
                setLoader(false)
            }).catch((err) => {
                console.log(err);
                setLoader(false)
            })
    }

    useEffect(() => {
        getAllUserSubTasks();
        getAllUserTasks()
    }, []);

    const toggleTask = (id) => {
        setExpandedTasks(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(id)) {
                newExpanded.delete(id); // Close task if already open
            } else {
                newExpanded.add(id); // Open task
            }
            return newExpanded;
        });
    };

    const toggleCompletion = (id) => {
        setLoader(true)
        const taskToUpdate = subTasks.find(task => task._id === id);
        const newStatus = taskToUpdate.status === 'pending' ? 'done' : 'pending';

        axios.put(`${process.env.REACT_APP_API_URL}/api/subtask/${id}`, { status: newStatus })
            .then((res) => {
                setLoader(false)
                setSubTasks(subTasks.map(task =>
                    task._id === id ? { ...task, status: newStatus } : task
                ));
            })
            .catch((err) => {
                setLoader(false)
                console.log(err);
            });
    };

    const handleCreateOrUpdateSubTask = (e) => {
        setLoader(true)
        e.preventDefault();
        const apiUrl = isEditing
            ? `${process.env.REACT_APP_API_URL}/api/subtask/${currentTaskId}`
            : `${process.env.REACT_APP_API_URL}/api/subtask`;

        const method = isEditing ? 'put' : 'post';

        axios[method](apiUrl, {
            userId: userData?.userId,
            parentTask: data?._id,
            ...newSubTask,
        })
            .then((res) => {
                setLoader(false)
                // if (isEditing) {
                //     setSubTasks(subTasks.map(task =>
                //         task._id === currentTaskId ? res.data : task
                //     ));
                // } else {
                //     setSubTasks([...subTasks, res.data]);
                // }
                getAllUserSubTasks();

                setShowModal(false);
                setNewSubTask({ subTaskName: '', description: '' });
                setIsEditing(false);
                setCurrentTaskId(null);
            })
            .catch((err) => {
                setLoader(false)
                console.log(err);
            });
    };
    const deleteSubTask = (id) => {
        setLoader(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/api/subtask/${id}`)
            .then((res) => {
                setLoader(false)
                getAllUserSubTasks();
            }).catch((err) => {
                setLoader(false)
                console.log(err);
                toast.dismiss()
                toast.error('Something went wrong!')
            })
    }

    const openEditModal = (task) => {
        setNewSubTask({ subTaskName: task.subTaskName, description: task.description });
        setCurrentTaskId(task._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const addWithTask = (parentTask) => {
        setNewSubTask(prev => {
            return { ...prev, parentTask }
        });
        setShowModal(true);
    }


    const handleCloseModal = () => {
        setShowModal(false);
        setNewSubTask({ subTaskName: '', description: '' });
        setIsEditing(false);
        setCurrentTaskId(null);
    };

    useEffect(() => {
        getAllUserSubTasks()
    }, [])
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
        <div className='lg:rounded-lg rounded-[3px]'>
            <div class="container mx-auto lg:rounded-lg rounded-[3px]  p-0 h-[80vh] md:w-[70vw] w-[80vw] overflow-scroll">
                <div class=" lg:rounded-lg rounded-[3px]  p-2 py-6 lg:px-8">
                    <div class="flex items-center justify-between mb-6">
                        <h1 class="text-2xl font-bold text-gray-900 ">{data?.taskGroup.groupName}</h1>
                        <button onClick={(e)=>{
                            e.stopPropagation()
                            setOpen(false)
                            }
                        }>Close</button>
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
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 align-center'>
                        {data?.audioFile ? <div class="">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900  mb-2">Audio Player</h2>
                                <audio controls>
                                    <source src={data?.audioFile} type="audio/mp4" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        </div> : null}
                        {data?.pdfFile && (
                            <div >
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Attached File</h3>
                                <a href={data?.pdfFile} className="flex items-center  bg-blue-400 hover:bg-blue-300 cursor-pointer p-4 lg:rounded-lg rounded-[3px] ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        className="bi bi-file-earmark"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h4.5L14 4.5zM10 4a1 1 0 0 1-1-1V1.5L14 5h-3.5A1.5 1.5 0 0 1 9 3.5V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5H10z" />
                                    </svg>
                                    <span className="ml-2 font-bold ">Download File</span>
                                </a>
                            </div>
                        )}
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
                        </div>
                        <div>
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
                    <hr className='mt-4 mb-4 ' />
                    <div>
                        <div className='flex justify-between items-center mb-8'>
                            <div>
                            <h3 className='text-xl font-bold'>Your Sub Tasks  <span className='text-white cursor-pointer px-2 py-1 text-sm bg-orange-500 rounded-full  font-bold'> {subTasks?.filter((subTask) => subTask.status === 'done').length}/{subTasks?.length}</span></h3>
                            <span className='text-gray-500 '>Below Subtasks are only visible to you</span>
                            </div>
                            <button
                                className={`px-4 py-1 text-md rounded text-white hover:bg-green-700 active:bg-green-900 ${'bg-green-800'}`}
                                onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                            >
                            Create
                            </button>
                        </div>
                        {
                            subTasks?.map((subTask) => {
                                return (
                                    <>
                                        <div key={subTask._id} className="mx-4 mb-4">
                                            <div
                                                className="flex justify-between items-center px-2 py-1 bg-white rounded shadow cursor-pointer"
                                                onClick={() => toggleTask(subTask._id)}
                                            >
                                                <div className="flex items-center">
                                                    <span
                                                        className={`h-4 w-4 rounded-full mr-3 ${subTask.status === 'done' ? 'bg-green-600' : 'bg-gray-300'}`}
                                                    ></span>
                                                    <span
                                                        className={`text-sm ${subTask.status === 'done' ? 'line-through text-gray-500' : ''} cursor-pointer select-none`}
                                                    >
                                                        {subTask.subTaskName}
                                                    </span>
                                                </div>
                                                <div className="flex  items-center space-x-4">
                                                    <button
                                                        className={`px-2 py-1 text-sm rounded text-white ${subTask.status === 'done' ? 'bg-red-500' : 'bg-green-500'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCompletion(subTask._id);
                                                        }}
                                                    >
                                                        {subTask.status === 'done' ? 'Undo' : 'Done'}
                                                    </button>
                                                    {/* <button
                                                            className=" px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // openEditModal(subTask);
                                                            }}
                                                        >
                                                            Edit
                                                        </button> */}
                                                </div>
                                            </div>
                                            {/* {expandedTasks.has(subTask._id) && (
                                                    <div className="p-1 mx-[40px] bg-red-100 rounded shadow mt-2">
                                                        {subTask?.description?<p className='font-normal text-sm'><span className='font-bold text-md'>Description :</span>{subTask.description}</p>:'No description provided'}
                                                    </div>
                                                )} */}
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                    {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={() => handleCloseModal()} // Close modal on backdrop click
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg md:w-[500px] relative"
                        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            {isEditing ? 'Edit Subtask' : 'Create Subtask'}
                        </h2>
                        <form onSubmit={handleCreateOrUpdateSubTask}>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Subtask Name</label>
                                <input
                                    type="text"
                                    value={newSubTask?.subTaskName}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, subTaskName: e.target.value })}
                                    className="mt-1 block w-full border  border-gray-300 rounded px-3 py-2"
                                    required

                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Description</label>
                                <textarea

                                    value={newSubTask?.description}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, description: e.target.value })}
                                    className="mt-1 block w-full  border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="mb-4">
                                <select
                                    value={newSubTask?.parentTask}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, parentTask: e.target.value })}
                                    id="small"
                                    className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                >
                                    <option value="" disabled selected>Choose a task</option>
                                    {userTasks?.map((task) => (
                                        <option key={task._id} value={task._id}>{task.taskName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-2 py-1 text-md font-normal bg-gray-500 text-white rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-2 py-1 text-md font-normal bg-blue-500 text-white rounded"
                                >
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
                    <div className='text-black'>
                        <div >
                            {status}

                        </div>
                    </div>
                    <hr className='font-bold text-gray-800'/>
                    <div className='mt-5 mb-5'>
                        <div>
                            <h3 className='text-black text-xl mb-5 font-bold'>All logs</h3>
                        </div>
                        <div className='ml-5'>
                            {
                                logs?.map((log)=>{
                                    return (
                                        <>
                                            <div>
                                                <Logs log={log}/>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>






                </div>

            </div>
        </div>
    )
}

export default ViewTask

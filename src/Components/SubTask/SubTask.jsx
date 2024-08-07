import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../global/UserContext';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const SubTask = () => {
    const { userData } = useContext(UserContext);
    const [userTasks, setUserTasks] = useState([]);
    const [subTasks, setSubTasks] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState(new Set()); // Track expanded tasks
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [newSubTask, setNewSubTask] = useState({ subTaskName: '', description: '' });
    const [selectedOption, setSelectedOption] = useState('all');
    const [filterUserTasks, setFilterUserTasks] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        console.log('inside the option')
        if (selectedOption === 'pendingTask') {
            console.log('insdie the if condition')
            setFilterUserTasks(userTasks?.filter(task => ['In Progress', ""].includes(task.status)))
        } else {
            setFilterUserTasks(userTasks)
        }
        console.log('selected option', selectedOption)
    }, [selectedOption])


    const getAllUserSubTasks = () => {
        setLoader(true)
        axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/${userData?.userId}/user_tasks`)
            .then((res) => {
                setLoader(false)
                setSubTasks(res.data);
            }).catch((err) => {
                setLoader(false)
                console.log(err);
            });
    };

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
        const newStatus = taskToUpdate.status === 'Undo' ? 'done' : 'Undo';

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
    const deleteSubTask = (id)=>{
        setLoader(true)
        axios.delete(`${process.env.REACT_APP_API_URL}/api/subtask/${id}`)
        .then((res)=>{
            setLoader(false)
            getAllUserSubTasks();
        }).catch((err)=>{
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



    return (
        <div className="mx-10 mt-10">
            <div>
                <button
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                >
                    Create Subtask
                </button>
            </div>
            <div className="text-sm mb-4 font-medium text-center text-gray-500 border-b border-gray-200 ">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2 cursor-pointer">
                        <span onClick={() => setSelectedOption('all')} className={`inline-block p-4 font-bold text-md border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300  ${selectedOption === 'all' ? "inline-block p-4 font-bold text-md text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" : ""}`}>All</span>
                    </li>
                    <li className="me-2 cursor-pointer">
                        <span onClick={() => setSelectedOption('taskWise')} className={`inline-block p-4 font-bold text-md rounded-t-lg active ${selectedOption === 'taskWise' ? "inline-block p-4 font-bold text-md text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" : ""}`} aria-current="page">Task Wise</span>
                    </li>
                    <li className="me-2 cursor-pointer">
                        <span onClick={() => setSelectedOption('pendingTask')} className={`inline-block p-4 font-bold text-md rounded-t-lg active ${selectedOption === 'pendingTask' ? "inline-block p-4 font-bold text-md text-blue-600 border-b-2 border-blue-600 rounded-t-lg active" : ""}`} aria-current="page">Pending Task</span>
                    </li>

                </ul>
            </div>


            {selectedOption === 'all' &&  subTasks?.map((task) => (
                <div key={task._id} className="mb-4">
                    <div
                        className="flex justify-between items-center p-4 bg-white rounded shadow cursor-pointer"
                        onClick={() => toggleTask(task._id)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`h-4 w-4 rounded-full mr-3 ${task.status === 'done' ? 'bg-green-600' : 'bg-gray-300'}`}
                            ></span>
                            <span
                                className={`text-lg ${task.status === 'done' ? 'line-through text-gray-500' : ''} cursor-pointer select-none`}
                            >
                                {task.subTaskName}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                className={`px-1 py-1 rounded text-white ${task.status === 'done' ? 'bg-red-500' : 'bg-green-500'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCompletion(task._id);
                                }}
                            >
                                {task.status === 'done' ? 'Undo' : 'Done'}
                            </button>
                            {/* <button
                                className="px-2 py-1 bg-red-500 text-white rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(task);
                                }}
                            >
                                Edit
                            </button> */}
                            <button
                                className="px-2 py-1 bg-red-800 text-white rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSubTask(task._id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    {/* {expandedTasks.has(task._id) && (
                        <div className="p-4 bg-purple-100 rounded shadow mt-2">
                        {task?.description?<p className='font-normal text-sm'><span className='font-bold text-md'>Description :</span>{task.description}</p>
                            :<p className='font-normal text-sm'>No Description</p>
                        }

                        </div>
                    )} */}
                </div>
            ))}

            {
                ['taskWise', 'pendingTask'].includes(selectedOption) && filterUserTasks?.map((task) => (
                    <div key={task._id} className="mb-4">
                        <div
                            className="flex justify-between items-center p-4 bg-white rounded shadow cursor-pointer"
                            onClick={() => toggleTask(task._id)}
                        >
                            <div className="flex items-center">
                                <span
                                    className={`h-4 w-4 rounded-full mr-3 ${expandedTasks.has(task._id) ? 'bg-purple-600' : 'bg-gray-300'}`}
                                ></span>
                                <span
                                    className={`text-lg  ${task.status === 'done' ? 'line-through text-gray-500' : ''} cursor-pointer select-none`}
                                >
                                    {task.taskName}
                                </span>

                            </div>

                            <div className="flex items-center space-x-4">
                                <span>
                                    {subTasks?.filter(subtask => subtask.parentTask === task._id).length} Subtasks

                                </span>
                                <button
                                    className={`px-2 py-1 rounded text-white bg-green-600 `}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // toggleCompletion(task._id);
                                        setIsEditing(false);
                                        addWithTask(task._id);
                                    }}
                                >
                                    Add SubTask
                                </button>

                            </div>
                        </div>
                        {expandedTasks.has(task._id) && (
                            <div className="p-4 bg-purple-100 rounded shadow mt-2">
                                {
                                    subTasks?.filter(subtask => subtask.parentTask === task._id).map((subTask) => {
                                        return (
                                            <div key={subTask._id} className="mx-10 mb-4">
                                                <div
                                                    className="flex justify-between items-center px-2 py-1 bg-white rounded shadow cursor-pointer"
                                                    onClick={() => toggleTask(subTask._id)}
                                                >
                                                    <div className="flex items-center">
                                                        <span
                                                            className={`h-4 w-4 rounded-full mr-3 ${subTask.status === 'done' ? 'bg-green-600'  : 'bg-gray-300'}`}
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
                                                        <button
                                                            className=" px-2 py-1 text-sm bg-red-500 text-white rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(subTask);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* {expandedTasks.has(subTask._id) && (
                                                    <div className="p-1 mx-[40px] bg-red-100 rounded shadow mt-2">
                                                        {subTask?.description?<p className='font-normal text-sm'><span className='font-bold text-md'>Description :</span>{subTask.description}</p>:'No description provided'}
                                                    </div>
                                                )} */}
                                            </div>
                                        )
                                    })
                                }

                                {
                                    subTasks?.filter(subtask => subtask.parentTask === task._id).length === 0 && <p>No subtasks found</p>
                                }
                            </div>
                        )}
                    </div>
                ))
            }

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={() => handleCloseModal()} // Close modal on backdrop click
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg w-1/3 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            {isEditing ? 'Edit Subtask' : 'Create Subtask'}
                        </h2>
                        <form onSubmit={handleCreateOrUpdateSubTask}>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Subtask Name <span className="text-red-600 ">*</span></label>
                                <input
                                    type="text"
                                    value={newSubTask?.subTaskName}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, subTaskName: e.target.value })}
                                    className="mt-1 block w-full border  border-gray-300 rounded px-3 py-2"
                                    required

                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-md font-medium text-gray-700">Description </label>
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
        </div>
    );
};

export default SubTask;

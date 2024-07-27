import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../global/UserContext';

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

    useEffect(() => {
        console.log('inside the option')
        if (selectedOption === 'pendingTask') {
            console.log('insdie the if condition')
            setFilterUserTasks(userTasks.filter(task => ['In Progress', 'To Do', 'Archive'].includes(task.status)))
        } else {
            setFilterUserTasks(userTasks)
        }
        console.log('selected option', selectedOption)
    }, [selectedOption])


    const getAllUserSubTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/${userData?.userId}/user_tasks`)
            .then((res) => {
                setSubTasks(res.data);
            }).catch((err) => {
                console.log(err);
            });
    };

    const getAllUserTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/subtask/assigned/${userData?.userId}`)
            .then((res) => {
                setUserTasks(res.data);
            }).catch((err) => {
                console.log(err);
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
        const taskToUpdate = subTasks.find(task => task._id === id);
        const newStatus = taskToUpdate.status === 'pending' ? 'done' : 'pending';

        axios.put(`${process.env.REACT_APP_API_URL}/api/subtask/${id}`, { status: newStatus })
            .then((res) => {
                setSubTasks(subTasks.map(task =>
                    task._id === id ? { ...task, status: newStatus } : task
                ));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleCreateOrUpdateSubTask = (e) => {
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
                if (isEditing) {
                    setSubTasks(subTasks.map(task =>
                        task._id === currentTaskId ? res.data : task
                    ));
                } else {
                    setSubTasks([...subTasks, res.data]);
                }
                setShowModal(false);
                setNewSubTask({ subTaskName: '', description: '' });
                setIsEditing(false);
                setCurrentTaskId(null);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const openEditModal = (task) => {
        setNewSubTask({ subTaskName: task.subTaskName, description: task.description });
        setCurrentTaskId(task._id);
        setIsEditing(true);
        setShowModal(true);
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

            {/* {
        userTasks?.map((task) => (
          <div key={task._id} className="mb-4">

            <h3>{task?.taskName}</h3>
      
          </div>
        ))
            
      } */}

            {selectedOption === 'all' && subTasks?.map((task) => (
                <div key={task._id} className="mb-4">
                    <div
                        className="flex justify-between items-center p-4 bg-white rounded shadow cursor-pointer"
                        onClick={() => toggleTask(task._id)}
                    >
                        <div className="flex items-center">
                            <span
                                className={`h-4 w-4 rounded-full mr-3 ${task.status === 'done' ? 'bg-green-600' : expandedTasks.has(task._id) ? 'bg-purple-600' : 'bg-gray-300'}`}
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
                                {task.status === 'done' ? 'Pending' : 'Done'}
                            </button>
                            <button
                                className="px-2 py-1 bg-yellow-500 text-white rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(task);
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                    {expandedTasks.has(task._id) && (
                        <div className="p-4 bg-purple-100 rounded shadow mt-2">
                            <p>{task.description}</p>
                        </div>
                    )}
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
                                        setShowModal(true);
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
                                                            className={`h-4 w-4 rounded-full mr-3 ${subTask.status === 'done' ? 'bg-green-600' : expandedTasks.has(subTask._id) ? 'bg-purple-600' : 'bg-gray-300'}`}
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
                                                            {subTask.status === 'done' ? 'Pending' : 'Done'}
                                                        </button>
                                                        <button
                                                            className=" px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(subTask);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                                {expandedTasks.has(subTask._id) && (
                                                    <div className="p-1 mx-[40px] bg-red-100 rounded shadow mt-2">
                                                       <p className='font-normal text-sm'><span className='font-bold text-md'>Description :</span>{subTask.description}</p>
                                                    </div>
                                                )}
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
                    onClick={() => setShowModal(false)} // Close modal on backdrop click
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg w-1/3 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            {isEditing ? 'Edit Subtask' : 'Create Subtask'}
                        </h2>
                        <form onSubmit={handleCreateOrUpdateSubTask}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Subtask Name</label>
                                <input
                                    type="text"
                                    value={newSubTask.subTaskName}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, subTaskName: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={newSubTask.description}
                                    onChange={(e) => setNewSubTask({ ...newSubTask, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dropdown, IconButton, Menu, MenuButton, MenuItem } from '@mui/joy';
import { toast } from 'react-toastify';

const updateTaskStatus = async (id, status, body) => {
    const response = await fetch(`http://localhost:5000/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, ...body }), // Include additional data in the body
    });

    if (!response.ok) {
        throw new Error('Failed to update task status');
    }

    toast.success("Task Status Updated");
    return response.json();
};

function Archive() {
    const [userid, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [archiveTasks, setArchiveTasks] = useState([]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            console.log('Response data:', response.data);

            const userTasks = response.data.filter(task => {
                const isOwner = task.owner.id === userId;
                const isPerson = task.people.some(person => person.userId === userId);
                return isOwner || isPerson;
            });

            const ArchiveTasks = userTasks.filter(task => task.status === 'Archive');
            setArchiveTasks(ArchiveTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setUserId(userId);
            fetchTasks(userId);
        }
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const handleUnArchive = async (taskId) => {
        if (!taskId) {
            console.error('Task ID is undefined');
            toast.error('Task ID is undefined');
            return;
        }

        try {
            console.log(`Updating task ${taskId} to Completed`);
            await updateTaskStatus(taskId, 'Completed', {});
            fetchTasks(userid); // Re-fetch tasks after unarchiving
        } catch (error) {
            console.error('Failed to update task status:', error);
            toast.error('Failed to update task status');
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {archiveTasks.map((task, index) => (
                            <div key={index} className="bg-pink-100 rounded-lg p-6 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <div className='flex font-bold items-center gap-3 text-gray-500 text-sm'>
                                        <div className='flex'>
                                            <svg fill="#808080" width="20px" className='' height="20px" viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                <title>group</title>
                                                <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path>
                                            </svg>
                                            {task?.taskGroup.groupName}
                                        </div>
                                        <span className="px-3 py-1 rounded-sm text-sm font-bold text-gray-800 bg-green-300">
                                            {task?.status}
                                        </span>
                                    </div>
                                    <Dropdown>
                                        <MenuButton
                                            className="rounded-md bg-gray-300"
                                            slots={{ root: IconButton }}
                                            slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" style={{ color: "black" }} height="13" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                                            </svg>
                                        </MenuButton>
                                        <Menu className=''>
                                            <MenuItem onClick={() => handleUnArchive(task._id)}>UnArchive</MenuItem>
                                        </Menu>
                                    </Dropdown>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">{task.taskName}</h3>
                                <p className="text-sm text-gray-500 text-gray-400 mb-4">{task.description}</p>
                                <div className="flex items-center justify-between text-sm font-bold text-gray-800 mb-2">
                                    <span>Start: {task?.startDate ? formatDate(task.startDate) : 'N/A'}</span>
                                    <span>End: {task?.endDate ? formatDate(task.endDate) : 'N/A'}</span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Archive;

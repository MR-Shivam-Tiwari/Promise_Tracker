import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DragAndDropComponent from './Task Mange/DragAndDropComponent';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/joy';
import schedule from 'node-schedule';
import { toast } from 'react-toastify';

function Task() {
    const [tasks, setTasks] = useState([]);
    const [userid, setuserid] = useState('');
    const selectedDateRef = useRef(null);
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksCancelled, setTasksCancelled] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allTasks, setAllTasks] = useState([]);
    const [taskGroups, setTaskGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const navigate = useNavigate();
    const location = useLocation();



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
        const fetchDataAndArchiveOldTasks = async () => {
            try {
                // Fetch data
                const response = await axios.get('https://ptb.insideoutprojects.in/api/tasks');
                console.log('Response data:', response.data);

                // Filter tasks based on the user's ID
                const userTasks = response.data.filter(task => {
                    // Check if the owner's ID matches the user's ID
                    const isOwner = task.owner.id === userid;

                    // Check if any of the people in the task match the user's ID
                    const isPerson = task.people.some(person => person.userId === userid);

                    // Return true if either condition is true
                    return isOwner || isPerson;
                });

                // Set state with tasks matching the user's ID
                setTasks(userTasks);
                setAllTasks(userTasks);

                // Separate filtered tasks based on status and set them in their corresponding states
                const todoTasks = userTasks.filter(task => !task.status || task.status === 'To Do');
                const inProgressTasks = userTasks.filter(task => task.status === 'In Progress');
                const completedTasks = userTasks.filter(task => task.status === 'Completed');
                const cancelledTasks = userTasks.filter(task => task.status === 'Cancelled');
                setTasksToDo(todoTasks);
                setTasksInProgress(inProgressTasks);
                setTasksCompleted(completedTasks);
                setTasksCancelled(cancelledTasks);

                // Extract unique task groups
                const uniqueTaskGroups = [...new Set(userTasks.map(task => task?.taskGroup?.groupName))];
                setTaskGroups(uniqueTaskGroups);

                setLoading(false);

                // Archive old tasks
                try {
                    const archiveResponse = await fetch('https://ptb.insideoutprojects.in/api/archiveOldTasks', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!archiveResponse.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const archiveData = await archiveResponse.json();
                    console.log('Tasks archived successfully:', archiveData);
                    // toast.success(`Archived ${archiveData.updatedTasks.length} tasks`);
                } catch (archiveError) {
                    console.error('Error archiving tasks:', archiveError);
                    alert('Failed to archive tasks');
                }

            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        // Fetch data only when the component mounts or when userid changes
        if (userid) {
            fetchDataAndArchiveOldTasks();
        }
    }, [userid]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const groupName = searchParams.get('groupName');

        // Set selected group based on the groupName parameter from URL
        if (groupName) {
            setSelectedGroup(groupName);
        }
    }, [location.search]);

    useEffect(() => {
        if (selectedGroup !== '') {
            // Filter tasks based on selected group name
            const filteredTasks = allTasks.filter(task => task?.taskGroup?.groupName === selectedGroup);

            // Separate filtered tasks based on status and set them in their corresponding states
            setTasksToDo(filteredTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(filteredTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(filteredTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(filteredTasks.filter(task => task.status === 'Cancelled'));
        } else {
            // Set all tasks if no group is selected
            setTasksToDo(allTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(allTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(allTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(allTasks.filter(task => task.status === 'Cancelled'));
        }
    }, [selectedGroup, allTasks]);




    return (
        <div>
            <div className="flex flex-col h-full bg-white rounded text-black ">
                <div className='flex items-center justify-between px-2'>
                    <div className='font-bold flex gap-3'>
                        <Button onClick={() => navigate('/archive-task')} variant='outlined' className='font-bold text-black bh-white border-gray-400 border-2'>Add Task</Button>
                        <Button onClick={() => navigate('/archive-task')} variant='outlined' className='font-bold text-black bh-white border-gray-400 border-2'>Archive Tasks</Button>

                    </div>
                    <div className='flex items-center gap-3 text-lg font-bold'>
                        <p>Filter By Groups</p>
                        {taskGroups.length > 0 && (
                            <Select value={selectedGroup} className='font-bold' onChange={(event, newValue) => setSelectedGroup(newValue)}>
                                {/* Dynamically generate options from unique task groups */}
                                <Option value="" className='font-bold'>All Tasks</Option>
                                {taskGroups.map((group, index) => (
                                    <Option className='font-bold text-gray-400' key={index} value={group}>
                                        {group}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </div>
                </div>
                <DragAndDropComponent tasksToDo={tasksToDo} loading={loading} tasksCancelled={tasksCancelled} tasksCompleted={tasksCompleted} tasksInProgress={tasksInProgress} />
            </div>
        </div>
    )
}

export default Task;

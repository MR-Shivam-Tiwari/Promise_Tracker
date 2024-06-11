import { Button, Card, Checkbox, Chip, IconButton, Modal, ModalDialog, Sheet, Typography } from '@mui/joy'
import axios from 'axios';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import React, { useEffect, useRef, useState } from 'react'
import DragAndDropComponent from './Task Mange/DragAndDropComponent';


import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';


function Task() {
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('To Do');
    const [userid, setuserid] = useState("")
    const selectedDateRef = useRef(null);
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksCancelled, setTasksCancelled] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const buttonContainerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [allTasks, setAllTasks] = useState([]);
    const [taskGroups, setTaskGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('group');

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
                const uniqueTaskGroups = [...new Set(userTasks.map(task => task.taskGroup.groupName))];
                setTaskGroups(uniqueTaskGroups);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        // Fetch data only when the component mounts or when userid changes
        fetchData();

        // Specify the dependency array to include userid to trigger the effect when userid changes
    }, [userid]);

    const handleGroupChange = (selectedGroup) => {
        setSelectedGroup(selectedGroup);
        if (selectedGroup === 'group') {
            // Show all tasks
            setTasksToDo(allTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(allTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(allTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(allTasks.filter(task => task.status === 'Cancelled'));
        } else {
            // Filter tasks based on the selected group
            const filteredTasks = allTasks.filter(task => task.taskGroup.groupName === selectedGroup);

            // Separate filtered tasks based on status and set them in their corresponding states
            setTasksToDo(filteredTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(filteredTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(filteredTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(filteredTasks.filter(task => task.status === 'Cancelled'));
        }
    };






    return (
        <div>
            <div className="flex flex-col h-full bg-white rounded text-black ">
               
                <div className='flex items-center justify-between px-2'>
                    <div className='font-bold'>

                    </div>
                    <div className='flex  items-center gap-3 text-lg font-bold' >
                        <p>Filter By Groups</p>

                        <Select value={selectedGroup} className='font-bold' onChange={(event, newValue) => handleGroupChange(newValue)}>
                            <Option value="group" className='font-bold'>All Tasks</Option>
                            {/* Dynamically generate options from unique task groups */}
                            {taskGroups.map((group, index) => (
                                <Option className='font-bold text-gray-400' key={index} value={group}>
                                    {group}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>


                <DragAndDropComponent tasksToDo={tasksToDo} loading={loading} tasksCancelled={tasksCancelled} tasksCompleted={tasksCompleted} tasksInProgress={tasksInProgress} />

            </div>
        </div>
    )
}

export default Task

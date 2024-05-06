import { Button, Card, Checkbox, Chip, IconButton, Modal, ModalDialog, Sheet, Typography } from '@mui/joy'
import axios from 'axios';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import React, { useEffect, useRef, useState } from 'react'
import DragAndDropComponent from './Task Mange/DragAndDropComponent';





function Task() {
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('To Do');
    const [selectedDate, setSelectedDate] = useState('');
    const [userid, setuserid] = useState("")
    const selectedDateRef = useRef(null);
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksCancelled, setTasksCancelled] = useState([]);

    const buttonClass = (index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 2 + index);
        const formattedDate = currentDate.toISOString().split('T')[0];
        const isSelected = selectedDate === formattedDate;
        const isToday = formattedDate === new Date().toISOString().split('T')[0];

        let className = `inline-flex items-center ${isSelected ? 'bg-blue-500' : isToday ? 'bg-blue-200' : 'bg-gray-200'} text-black justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md`;

        return className;
    };

    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;

            setuserid(userId);
        }
    }, []);




    const handleDateClick = (formattedDate) => {
        // Set the selected date
        setSelectedDate(formattedDate);

        selectedDateRef.current = formattedDate;


    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                console.log('Response data:', response.data);

                const selectedTasks = response.data.filter(task => {
                    try {
                        const startDate = new Date(task.startDate).toISOString().split('T')[0]; // Get the startDate from the task in "YYYY-MM-DD" format
                        // console.log('Start Date:', startDate);
                        // console.log('Selected Date:', selectedDate);
                        return startDate === selectedDate; // Return true if the startDate matches the selectedDate
                    } catch (error) {
                        console.error('Error parsing start date:', error);
                        return false; // Exclude tasks with invalid start dates
                    }
                });
                setTasks(selectedTasks); // Set state with tasks matching the selectedDate

                // Separate filtered tasks based on status and set them in their corresponding states
                const todoTasks = selectedTasks.filter(task => !task.status || task.status === 'To Do');
                const inProgressTasks = selectedTasks.filter(task => task.status === 'In Progress');
                const completedTasks = selectedTasks.filter(task => task.status === 'Completed');
                const cancelledTasks = selectedTasks.filter(task => task.status === 'Cancelled');

                setTasksToDo(todoTasks);
                setTasksInProgress(inProgressTasks);
                setTasksCompleted(completedTasks);
                setTasksCancelled(cancelledTasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };


        fetchData();
    }, [selectedDate]); // Fetch data whenever selectedDate changes



    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;

            setuserid(userId);

            // Set selected date as today's date
            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            selectedDateRef.current = today; // Update selectedDateRef
        }
    }, []);
 

    return (
        <div>
            <div className="flex flex-col h-full">
                <header className="bg-gray-100 rounded-lg py-2 px-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto h-14" style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
                        {[...Array(33).keys()].map((index) => {
                            const currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() - 2 + index);
                            const monthNames = ["January", "February", "March", "April", "May", "June",
                                "July", "August", "September", "October", "November", "December"];
                            const monthName = monthNames[currentDate.getMonth()];
                            const date = currentDate.getDate();

                            return (
                                <button
                                    key={index}
                                    className={buttonClass(index)}
                                    onClick={() => handleDateClick(currentDate.toISOString().split('T')[0])}
                                >
                                    {monthName} {date}
                                </button>
                            );
                        })}



                    </div>
                </header>



                <DragAndDropComponent tasksToDo={tasksToDo}  tasksCancelled={tasksCancelled} tasksCompleted={tasksCompleted} tasksInProgress={tasksInProgress}  />

            </div>
        </div>
    )
}

export default Task

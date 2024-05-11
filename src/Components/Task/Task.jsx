import { Button, Card, Checkbox, Chip, IconButton, Modal, ModalDialog, Sheet, Typography } from '@mui/joy'
import axios from 'axios';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import React, { useEffect, useRef, useState } from 'react'
import DragAndDropComponent from './Task Mange/DragAndDropComponent';





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

    const buttonClass = (currentDate) => {
        const formattedDate = currentDate.toISOString().split('T')[0];
        const isSelected = selectedDate === formattedDate;
        const isToday = formattedDate === new Date().toISOString().split('T')[0];

        let className = `inline-flex items-center ${isSelected ? 'bg-blue-500' : isToday ? 'bg-blue-200' : 'bg-gray-200'} text-black justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md`;

        return className;
    };

    useEffect(() => {
        if (buttonContainerRef.current) {
            const containerWidth = buttonContainerRef.current.offsetWidth;
            const buttons = buttonContainerRef.current.querySelectorAll('button');
            let selectedButton;
            buttons.forEach(button => {
                if (button.classList.contains('selected')) {
                    selectedButton = button;
                }
            });
            if (selectedButton) {
                const buttonWidth = selectedButton.offsetWidth;
                const selectedButtonOffset = selectedButton.offsetLeft;
                const scrollLeft = selectedButtonOffset - (containerWidth / 2) + (buttonWidth / 2);
                buttonContainerRef.current.scrollLeft = scrollLeft;
            }
        }
    }, [selectedDate]);





    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;

            setuserid(userId);
        }
    }, []);

    // const handleDateClick = (formattedDate) => {
    //     // Set the selected date
    //     setSelectedDate(formattedDate);
    //     selectedDateRef.current = formattedDate;
    // };

 useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks');
            console.log('Response data:', response.data);

            const selectedTasks = response.data.filter(task => {
                try {
                    // Get the startDate from the task
                    const startDate = task.startDate;

                    // Log the startDate and selectedDate for debugging
                    console.log('Start Date:', startDate);
                    console.log('Selected Date:', selectedDate);

                    // Compare the startDate with the selectedDate
                    return startDate === selectedDate;
                } catch (error) {
                    console.error('Error parsing start date:', error);
                    return false; // Exclude tasks with invalid start dates
                }
            });

            // Log the length of selectedTasks array for debugging
            console.log('Selected Tasks:', selectedTasks.length);

            // Set state with tasks matching the selectedDate
            setTasks(selectedTasks);

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
}, [selectedDate]);

    
    console.log("taskby userid " , tasks)



    // Handle click on date button
    const handleDateClick = (formattedDate) => {
        setSelectedDate(formattedDate);
    };



    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;

            setuserid(userId);

            const today = new Date().toISOString().split('T')[0];
            setSelectedDate(today);
            selectedDateRef.current = today;
        }
    }, []);

    useEffect(() => {
        // Scroll the selected button into view after rendering
        if (selectedDateRef.current && typeof selectedDateRef.current.scrollIntoView === 'function') {
            selectedDateRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }, [selectedDate]);




    return (
        <div>
            <div className="flex flex-col h-full bg-white rounded text-black p-2">
                <header className="bg-gray-100 rounded-lg py-2 px-3 flex items-center justify-between">
                    <div ref={buttonContainerRef} className="flex items-center gap-4 overflow-x-auto h-14" style={{
                        overflowX: 'auto',
                        overflowY: 'hidden', // Hide vertical scrollbar
                        scrollbarWidth: 'thin', // Thin scrollbar
                        msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        justifyContent: 'flex-start', // Align buttons to the start
                        cursor: 'pointer', // Change cursor to pointer
                    }}>

                        {[...Array(365).keys()].map((index) => {
                            const currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() - 180 + index);
                            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            const monthName = monthNames[currentDate.getMonth()];
                            const date = currentDate.getDate();

                            const formattedDate = currentDate.toISOString().split('T')[0];
                            const isSelected = selectedDate === formattedDate;
                            const isToday = formattedDate === new Date().toISOString().split('T')[0];

                            return (
                                <button
                                    key={index}
                                    data-index={index}
                                    className={`${isSelected ? 'selected' : ''} ${buttonClass(currentDate)}`}
                                    onClick={() => handleDateClick(formattedDate)}
                                >
                                    {monthName} {date}
                                </button>
                            );
                        })}

                    </div>

                </header>



                <DragAndDropComponent tasksToDo={tasksToDo} tasksCancelled={tasksCancelled} tasksCompleted={tasksCompleted} tasksInProgress={tasksInProgress} />

            </div>
        </div>
    )
}

export default Task

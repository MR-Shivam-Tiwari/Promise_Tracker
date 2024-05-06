import { Button, Checkbox, Chip, Modal, ModalDialog, Sheet, Typography } from '@mui/joy'
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import ModalClose from '@mui/joy/ModalClose';
import ViewTask from './ViewTask';
import DragAndDropComponent from './Task Mange/DragAndDropComponent';
function Task() {
    const [tasks, setTasks] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('To Do');
    const [selectedDate, setSelectedDate] = useState('');
    const [open, setOpen] = React.useState(false);
    const [userid, setuserid] = useState("")
    const selectedDateRef = useRef(null);
    // const [filteredTask, setFilteredTasks] = useState([]);

    // Define button classes based on whether the date is selected or today's date

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

    // Assuming tasks is an array containing the task objects




    const handleDateClick = (formattedDate) => {
        setSelectedDate(formattedDate);
        // filteredTasks ko refresh karne ke liye useEffect hook mein selectedDateRef.current ko update karenge
        selectedDateRef.current = formattedDate;
    };
    
    // useEffect hook mein selectedDateRef.current ka use karenge taaki selected date ke changes ko track kar sake
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks');
                const selectedDate = selectedDateRef.current; // Get the selected date
                const selectedTasks = response.data.filter(task => {
                    const createdAtDate = new Date(task.createdAt).toISOString().split('T')[0]; // Get the createdAt date
                    return createdAtDate === selectedDate; // Return true if the createdAt date matches the selected date
                });
                setTasks(selectedTasks); // Set state with tasks matching the selected date
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
    
        fetchData();
    }, [selectedDateRef.current]); // Fetch data when selected date changes
    
    


    // console.log("userid1:", userid);
    // Filter tasks based on selected status and selected date
    const filteredTasks = tasks.filter(task => {
        // Check if the task has an owner and if the owner's id matches the userid
        if (task.owner && task.owner.id === userid) {
            // Get the createdAt date in the format "YYYY-MM-DD"
            const createdAtDate = new Date(task.createdAt).toISOString().split('T')[0];
    
            // Check if createdAtDate matches the selected date
            if (selectedDate !== '' && createdAtDate !== selectedDate) {
                return false; // If not matched, exclude the task
            }
    
            // Filter tasks based on selected status
            if (selectedStatus === 'To Do') {
                // If selected status is 'To Do', filter tasks with status other than 'Completed' and 'Cancelled'
                return (task.status !== 'Completed' && task.status !== 'Cancelled');
            } else {
                // Otherwise, filter tasks based on selected status
                return task.status === selectedStatus;
            }
        }
        return false; // Exclude tasks without owner or with owner id not matching userid
    });
    


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
                            const formattedDate = currentDate.toISOString().split('T')[0];


                            return (
                                <button
                                    key={index}
                                    className={buttonClass(index)}
                                    onClick={() => handleDateClick(formattedDate)}
                                >
                                    {formattedDate}
                                </button>
                            );
                        })}


                    </div>
                </header>



                <div className=' bg-blue-50 p-3 mt-2 rounded-lg'>
                    <div className="flex items-center gap-4 overflow-x-auto h-14">
                        {['To Do', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                            <button
                                key={status}
                                className={`inline-flex items-center justify-center bg-blue-200 text-black whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md ${selectedStatus === status ? 'bg-blue-500 text-white' : ''}`}
                                onClick={() => setSelectedStatus(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                </div>

                <div className=" py-5">
                    <div className=" gap-2">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="mb-3 rounded-lg border bg-gray-200 bg-card text-black shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <p className="text-2xl font-semibold tracking-tight">{task?.taskGroup}</p>
                                    <div className="">
                                        <p>{task?.taskName}</p>
                                    </div>
                                    <div className='flex justify-between items-center '>
                                        <div className='flex items-center justify-start gap-3'>
                                            <p className="text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-black-900 flex items-center gap-2 "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-alarm" viewBox="0 0 16 16">
                                                        <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z" />
                                                        <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1" />
                                                    </svg> {task?.reminder}</span>
                                                </div>
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Chip variant="soft" color='success'>
                                                        {task?.status}
                                                    </Chip>
                                                    <Chip variant="soft" color='danger'>
                                                        {task?.category}
                                                    </Chip>
                                                </div>
                                            </p>
                                        </div>
                                        <div>
                                            <Button variant="soft" onClick={() => setOpen(true)}>View</Button>
                                        </div>
                                        <Modal
                                            aria-labelledby="modal-title"
                                            aria-describedby="modal-desc"
                                            open={open}
                                            onClose={() => setOpen(false)}
                                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                        >
                                            <ModalDialog maxWidth={1000} minWidth={1000} style={{ height: "800px", overflow: "auto" }} >
                                                <ModalClose variant="plain" sx={{ mt: 3 }} />
                                                <ViewTask task={task} status={task?.status} />
                                            </ModalDialog>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* <DragAndDropComponent /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task

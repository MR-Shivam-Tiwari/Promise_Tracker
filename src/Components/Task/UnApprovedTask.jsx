import { Box, IconButton, Modal, ModalClose, ModalDialog, Skeleton } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function UnApprovedTask() {
    const [tasks, setTasks] = useState([]);
    const [userid, setUserid] = useState('');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL+'/api/tasks');
                const userTasks = response.data.filter(task => {
                    // Check if the task's category is "Unapproved"
                    const inUnapproved = task.category === "Unapproved";
                    // Check if any person in the task's people array has a userId that matches the given userid
                    const isPerson = task.people.some(person => person.userId === userid);
                    // Return true if the task is unapproved and the user is in the people array
                    return inUnapproved && isPerson;
                });
                setTasks(userTasks);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setLoading(false);
            }
        };

        if (userid) {
            fetchData();
        }
    }, [userid]);

    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setUserid(userId);
        }
    }, []); 

    console.log("TaskUnapproved", tasks);
    const toggleModal = () => {
        setModal(!modal);
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
        toggleModal();
    };

    return (
        <div>
            <div className="border lg:rounded-lg rounded-[3px] overflow-hidden lexend-bold">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                                    Task
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                                    Task Members
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                                    Task Group
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0">
                                    Status
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&_:has([role=checkbox])]:pr-0 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {loading ? (
                            Array(10).fill().map((_, index) => (
                                <Box className="" key={index} mb={2} display="flex" alignItems="center">
                                    <Box ml={2} flexGrow={1}>
                                        <Skeleton variant="text" width="100%" />
                                        <Skeleton variant="text" width="80%" />
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            tasks.map(task => (
                                <tbody key={task?._id} className="[&_tr:last-child]:border-0">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                                            {task?.taskName}
                                        </td>
                                        <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                                            {task?.people.map(person => person.name).join(', ')}
                                        </td>
                                        <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 font-medium">
                                            {task?.taskGroup.groupName}
                                        </td>
                                        <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0">
                                            {task.category === 'Approved' && (
                                                <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-900 ">
                                                    Approved
                                                </div>
                                            )}
                                            {task.category === 'Unapproved' && (
                                                <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-900 ">
                                                    Unapproved
                                                </div>
                                            )}
                                            {!task.category && (
                                                <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-900 ">
                                                    Not Updated
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle [&_:has([role=checkbox])]:pr-0 text-right">
                                            <IconButton onClick={() => handleViewTask(task)} >
                                                <button className="inline-flex bg-green-400 items-center justify-center border px-3 whitespace-nowrap rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-7 ">
                                                    View
                                                </button>
                                            </IconButton>
                                        </td>
                                    </tr>
                                </tbody>
                            ))
                        )}
                    </table>
                </div>
            </div>
            {modal && selectedTask && (
                <div>
                    <div
                        id="default-modal"
                        tabIndex="-1"
                        aria-hidden="true"
                        className="fixed inset-0 flex items-center justify-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto max-h-full"
                    >
                        <div className="relative w-full max-w-2xl max-h-full">
                            <div className="relative bg-white lg:rounded-lg rounded-[3px] shadow ">
                                <button
                                    type="button"
                                    onClick={toggleModal}
                                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 lg:rounded-lg rounded-[3px] text-sm p-1.5 ml-auto inline-flex items-center "
                                    data-modal-hide="default-modal"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                                <div className="px-6 py-12 lg:px-8">
                                    <div className='flex items-center justify-between'>
                                        <p className="mb-2"><strong>Task Name:</strong> {selectedTask.taskName}</p>
                                        <p className="mb-2"><strong>Task Members:</strong>  {selectedTask.people.map(person => person.name).join(', ')}</p>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <p className="mb-2"><strong>Task Group:</strong> {selectedTask.taskGroup.groupName}</p>
                                        <p className="mb-2"><strong>Status:</strong> {selectedTask.category}</p>
                                    </div>
                                    <div>
                                        <p className="mb-2 text-center"><strong>Reason Of UnApproved</strong> </p>
                                        <div className='  flex justify-center'>
                                            <p className='bg-red-300 px-4 p-2 rounded' >{selectedTask.remark}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Add more task details here as needed */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
                </div>
            )}
        </div>
    );
}

export default UnApprovedTask;

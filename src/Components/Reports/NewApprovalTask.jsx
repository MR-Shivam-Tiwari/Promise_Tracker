import { IconButton, Modal, ModalClose, ModalDialog } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ViewTask from '../Task/ViewTask';
import EditApprovals from '../Approvals/EditApprovals';

function NewApprovalTask() {
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [shouldRefreshData, setShouldRefreshData] = useState(false); // State variable to track whether data should be refreshed

    const fetchData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL+'/api/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedTask(null);
        fetchData(); // Call fetchData function when modal is closed
    };
    // const filteredTasks = (() => {
    //     switch (selectedStatus) {
    //         case 'All':
    //             return tasks.filter(task => task.status === 'Completed');
    //         case 'Approved':
    //             return tasks.filter(task => task.category === 'Approved');
    //         case 'Unapproved':
    //             return tasks.filter(task => task.category === 'Unapproved');
    //         default:
    //             return [];
    //     }
    // })();
console.log("totalTask", tasks)
    const handleEditClick = (task) => {
        setSelectedTask(task);
        setOpen(true);
    };
  return (
    <div>
       <div>
            <style>{`
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Inter', sans-serif;
          --font-sans: 'Inter';
        }
      `}</style>
            <style>{`
        body {
          font-family: 'Inter', sans-serif;
          --font-sans: 'Inter';
        }
      `}</style>
            <div class="flex flex-col h-screen">
                {/* <header class="bg-gray-100 lg:rounded-lg rounded-[3px] px-4 flex items-center justify-between">
                    <div class="flex items-center gap-4">

                        <div className=' bg-blue-50  py-1 lg:rounded-lg rounded-[3px]'>
                            <div className="flex items-center gap-4 overflow-x-auto h-14">
                                {['All', 'Approved', 'Unapproved'].map(status => (
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
                    </div>
                </header> */}
                <main class="flex-1 overflow-auto p-1 mt-3">
                    <div class="grid gap-4">
                        <div class="border lg:rounded-lg rounded-[3px] overflow-hidden">
                            <div class="relative w-full overflow-auto">
                                <table class="w-full caption-bottom text-sm">
                                    <thead class="[&amp;_tr]:border-b">
                                        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                Task
                                            </th>
                                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                Task Members
                                            </th>
                                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                Task Group
                                            </th>
                                            {/* <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                Reminder
                                            </th> */}
                                            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                                                Status
                                            </th>
                                            <th class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    {tasks.map(task => {
                                        // console.log("Task ID:", task?._id); // Log task ID
                                        return (
                                            <tbody key={task?._id} class="[&amp;_tr:last-child]:border-0">
                                                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                        {task?.taskName}
                                                    </td>
                                                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                        {task?.people.map(person => person.name).join(', ')}
                                                    </td>
 
                                                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                        {task?.taskGroup.groupName}
                                                    </td>
                                                    {/* <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                                        {task?.reminder}
                                                    </td> */}
                                                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                                                        {task.category === 'Approved' && (
                                                            <div className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-900  ">
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

                                                    <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                                                        <IconButton onClick={() => handleEditClick(task)} aria-label="Edit">

                                                            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    stroke-width="2"
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    class="h-4 w-4"
                                                                >
                                                                    <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"></path>
                                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                                    <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"></path>
                                                                </svg>
                                                                <span class="sr-only">Edit</span>
                                                            </button>
                                                        </IconButton>
                                                        <Modal
                                                            aria-labelledby="modal-title"
                                                            aria-describedby="modal-desc"
                                                            open={open}
                                                            onClose={() => { setOpen(false); setSelectedTask(null); }}
                                                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                        >
                                                            <ModalDialog maxWidth={600} minWidth={300} style={{ height: "520px", overflow: "auto" }} >
                                                                <ModalClose variant="plain" />
                                                                {selectedTask && <EditApprovals task={selectedTask} taskId={selectedTask?._id} onClose={handleCloseModal} />}
                                                            </ModalDialog>
                                                        </Modal>


                                                        {/* <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 text-red-500">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            stroke-width="2"
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            class="h-4 w-4"
                                                        >
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                        </svg>
                                                        <span class="sr-only">Delete</span>
                                                    </button> */}
                                                    </td>
                                                </tr>


                                            </tbody>
                                        );
                                    })}
                                </table>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
  )
}

export default NewApprovalTask

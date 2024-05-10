import { Button, IconButton } from '@mui/joy';
import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function NestedTable({ tasks }) {
    return (
        <table className="w-full bg-gray-200 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" className="px-6 py-3">Group Name</th>
                </tr>
            </thead>
            <tbody>
                {tasks && tasks.map((task, taskIndex) => (
                    <tr key={taskIndex}> {/* Assuming taskIndex is unique for each task */}
                        <td className="px-6 py-1">{task.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


function UserReports() {
    const [userData, setUserData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showNestedTable, setShowNestedTable] = useState(false); // State to toggle visibility

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/allassignuser');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleNestedTable = (groupName) => {
        setSelectedGroup(groupName);
        setShowNestedTable(!showNestedTable); // Toggle the state
    };

    const convertToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "User Name,Total Task,In Progress Task,Completed Task,Cancelled Task,Group Name\n" +
            userData.map(user => (
                `${user.user.name},${user.taskCounts.total},${user.taskCounts.inProgress},${user.taskCounts.completed},${user.taskCounts.cancelled},"${user.groupNames.join(', ')}"`
            )).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "user_reports.csv");
        document.body.appendChild(link);
        link.click();
    };


    return (
        <div className="relative overflow-x-auto shadow-md text-black bg-white sm:rounded-lg">
            <div className='flex justify-end p-2  ' style={{ marginTop: "" }}>

                <button

                    className={` inline-flex gap-2 text-gray-800 items-center justify-center bg-blue-200 text-black whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md `}
                    onClick={convertToCSV}
                >
                    Download File <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                    </svg>
                </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">User Name</th>
                        <th scope="col" className="px-6 py-3">Groups</th>
                        <th scope="col" className="px-6 py-3">Total Task</th>
                        <th scope="col" className="px-6 py-3">In Progress Task</th>
                        <th scope="col" className="px-6 py-3">Completed Task</th>
                        <th scope="col" className="px-6 py-3">Cancelled Task</th>
                    </tr>
                </thead>
                <tbody>
                    {userData
                        .slice() // Create a copy of the array to avoid mutating the original array
                        .sort((a, b) => a.user.name.localeCompare(b.user.name)) // Sort the array alphabetically based on user's name
                        .map((user) => (
                            <React.Fragment key={user.user._id}>
                                <tr className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                                        {user.user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.groupData && user.groupData.length > 0 ? (
                                            <Button
                                                aria-label="expand row"
                                                variant="plain"
                                                color="neutral"
                                                size="sm"
                                                onClick={() => toggleNestedTable(user.user._id)} // Pass user ID instead of group name
                                            >
                                                {selectedGroup === user.user._id && showNestedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} Group
                                            </Button>
                                        ) : (
                                            "No group"
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{user.taskCounts.total}</td>
                                    <td className="px-6 py-4">{user.taskCounts.inProgress}</td>
                                    <td className="px-6 py-4">{user.taskCounts.completed}</td>
                                    <td className="px-6 py-4">{user.taskCounts.cancelled}</td>
                                </tr>
                                {selectedGroup === user.user._id && showNestedTable && (
                                    <tr key={`${user.user._id}-nested`}>
                                        <td colSpan="6">
                                            <NestedTable
                                                tasks={user.groupData} // Pass user's group names directly
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}


                </tbody>


            </table>
            {/* <Button onClick={convertToCSV}>Download CSV</Button> */}
        </div>
    );
}

export default UserReports;

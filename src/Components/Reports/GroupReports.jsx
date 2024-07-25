import { Box, Skeleton } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

function GroupReports() {
    const [groupreport, setGroupReport] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL+'/api/tasksByGroup');
                const responseData = response.data;
                console.log("API Response:", responseData); // Log the response for debugging
    
                // Filter out objects with _id set to null
                const filteredData = responseData.filter(item => item._id !== null);
    
                if (Array.isArray(filteredData)) {
                    const sortedData = filteredData.sort((a, b) => {
                        // Assuming _id.groupName is the string you want to compare
                        const nameA = a._id.groupName || ""; 
                        const nameB = b._id.groupName || ""; 
                        return nameA.localeCompare(nameB);
                    });
                    setGroupReport(sortedData);
                    setLoading(false);
                } else {
                    console.error("Invalid API response format:", responseData);
                    setLoading(false);
                }
            } catch (error) {
                console.log("Error Fetching Task ", error);
                setLoading(false);
            }
        };
    
        fetchGroupData();
    }, []);
    

    const convertToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Group Name,Total Task,In progress Task,Completed Task,Cancelled Task\n" +
            groupreport.map(task =>
                `${task._id.groupName},${task.totalTasks},${task.inProgressTasks},${task.completedTasks},${task.cancelledTasks}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "group_reports.csv");
        document.body.appendChild(link);
        link.click();
    };

console.log("groupreport", groupreport)

    return (
        <div className="relative overflow-x-auto shadow-md text-black bg-white sm:rounded-lg">
            <div className='flex justify-end p-2'>
                <button
                    className={`inline-flex gap-2 text-gray-800 items-center justify-center bg-blue-200 text-black whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${loading ? 'pointer-events-none opacity-50' : ''} border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md`}
                    onClick={convertToCSV}
                    disabled={loading}
                >
                    Download File 
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                    </svg>
                </button>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Group Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">Total Task</div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">In progress Task</div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">Completed Task</div>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <div className="flex items-center">POSTPONED Task</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array(8).fill().map((_, index) => (
                            <tr key={index}>
                                <td colSpan="5">
                                    <Box mb={2} display="flex" alignItems="center">
                                        <Box ml={2} flexGrow={1}>
                                            <Skeleton variant="text" width="80%" />
                                            <Skeleton variant="text" width="60%" />
                                        </Box>
                                    </Box>
                                </td>
                            </tr>
                        ))
                    ) : (
                        groupreport.map(task => (
                            <tr className="bg-white border-b" key={task?._id?.groupName}>
                                <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                                    {task._id.groupName}
                                </td>
                                <td className="px-6 py-4">{task.totalTasks}</td>
                                <td className="px-6 py-4">{task.inProgressTasks}</td>
                                <td className="px-6 py-4">{task.completedTasks}</td>
                                <td className="px-6 py-4">{task.cancelledTasks}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GroupReports;

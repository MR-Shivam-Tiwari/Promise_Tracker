import axios from 'axios';
import React, { useEffect, useState } from 'react';
// import { saveAs } from 'file-saver';

function GroupReports() {
    const [groupreport, setGroupReport] = useState([]);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('https://ptb.insideoutprojects.in/api/tasksByGroup');
                const sortedData = response.data.sort((a, b) => a._id.localeCompare(b._id));
                setGroupReport(sortedData);
            } catch (error) {
                console.log("Error Fetching Task ", error);
            }
        };
        fetchGroupData();
    }, []);

    const convertToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "Group Name,Total Task,In progress Task,Completed Task,Cancelled task\n" +
            groupreport.map(task =>
                `${task._id},${task.totalTasks},${task.inProgressTasks},${task.completedTasks},${task.cancelledTasks}`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "group_reports.csv");
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
            {/* <button >Download CSV</button> */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                            <div className="flex items-center">Cancelled task</div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groupreport.map(task => (
                        <tr className="bg-white border-b" key={task._id}>
                            <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                                {task._id}
                            </td>
                            <td className="px-6 py-4">{task.totalTasks}</td>
                            <td className="px-6 py-4">{task.inProgressTasks}</td>
                            <td className="px-6 py-4">{task.completedTasks}</td>
                            <td className="px-6 py-4">{task.cancelledTasks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GroupReports;

import axios from 'axios';
import React, { useEffect, useState } from 'react';

function GroupReports() {
    const [groupreport, setGroupReport] = useState([]);

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tasksByGroup');
                setGroupReport(response.data);
            } catch (error) {
                console.log("Error Fetching Task ", error);
            }
        };
        fetchGroupData();
    }, []);

    // Fisher-Yates shuffle algorithm to shuffle array randomly
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Shuffle the groupreport array before rendering
    const shuffledGroupReport = shuffleArray(groupreport);

    return (
        <div className="relative overflow-x-auto shadow-md text-black sm:rounded-lg">
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
                    {shuffledGroupReport.map(task => (
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

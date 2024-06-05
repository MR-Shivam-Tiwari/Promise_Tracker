import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

function AcceptApprovals({ taskId, task, onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://3.85.170.118:5000/api/tasks/taskapprovals/${taskId}`, {
                status: 'In Progress',
                endDate: new Date().toISOString() // Set end date to current date/time
            });

            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Handle successful response
            console.log('Task approved successfully');
            toast.success('Task approved successfully');
            onClose(true);

        } catch (error) {
            console.error('There was a problem with the request:', error);
            toast.error('There was a problem with the request:', error.message);
            // Handle error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div class=" max-w-full   bg-gray-200 ">
                <div class="border-b px-6 py-4">
                    <h3 class="text-lg font-semibold text-gray-800">Task Date Approved</h3>
                </div>
                <div class="space-y-6 px-6 py-2 text-gray-800">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium">Task Member</h4>
                            <p class="text-gray-500 dark:text-gray-400">{task?.people.map(person => person.name).join(', ')}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium">Remark</h4>
                            <p class="text-gray-500 dark:text-gray-400">{task.remark[0].text}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium"> New Date</h4>
                            <p class="text-gray-500 dark:text-gray-400">{task.remark[0].date}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-between gap-2 border-t px-6 py-4">
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                        disabled={isLoading}
                        onClick={() => onClose(true)}
                    >
                        Cancel
                    </button>
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
                        onClick={handleApprove}
                        disabled={isLoading}
                    >
                        Approved
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AcceptApprovals;

import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';


function EditApprovals({ taskId, task }) {
    const [remark, setRemark] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);  // Declare and initialize isLoading state here
    // const [toast, setToast] = useState('');
    console.log("Task ID :", task?._id);
    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/category/${task?._id}`, {
                category: 'approved',
                status,
                remark
            });
            toast.success('Task approved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to approve task.');
        }
        setIsLoading(false);
    };

    const handleUnapprove = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/category/${task?._id}`, {
                category: 'unapproved',
                status,
                remark
            });
            toast.success('Task unapproved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to unapprove task.');
        }
        setIsLoading(false);
    };

    return (
        <div>
            <div>
                {/* {toast && <div className="absolute top-0 right-0 m-4 bg-white rounded shadow-lg px-6 py-4">{toast}</div>} */}
                <div class="w-[600px] max-w-full  mt-5 bg-gradient-to-br from-[#f0f0f0] to-[#d0d0d0] rounded-lg shadow-lg">
                    <div class="border-b px-6 py-4">
                        <h3 class="text-lg font-semibold text-gray-800">Company Offsite</h3>
                    </div>
                    <div class="space-y-6 px-6 py-8 text-gray-800">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-medium">Reminder Time</h4>
                                <p class="text-gray-500 dark:text-gray-400">{task?.reminder}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium">Task Member</h4>
                                <p class="text-gray-500 dark:text-gray-400">{task?.people.map(person => person.name).join(', ')}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-medium">Start Date</h4>
                                <p class="text-gray-500 dark:text-gray-400">{task?.startDate}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium">End Date</h4>
                                <p class="text-gray-500 dark:text-gray-400">{task?.endDate}</p>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium">Remark</h4>
                            <textarea
                                class="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2 h-24 bg-white text-gray-800 placeholder:text-gray-500 focus:bg-gray-300"
                                placeholder="Enter your remarks about the Task"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 border-t px-6 py-4">
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                            onClick={handleUnapprove}
                            disabled={isLoading}  // Disable the button based on isLoading state
                        >
                            Unapprove
                        </button>
                        <button
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
                            onClick={handleApprove}
                            disabled={isLoading}  // Disable the button based on isLoading state
                        >
                            Approve
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditApprovals

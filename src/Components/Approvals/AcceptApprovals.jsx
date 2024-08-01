import axios from 'axios';
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { UserContext } from '../../global/UserContext';

function AcceptApprovals({ taskId, task, onClose }) {
    const { userData } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const [remarkForRejection, setRemarkForRejection] = useState('');

    const handleApprove = async () => {
        setIsLoading(true);
        try {
            const response = await axios.put(process.env.REACT_APP_API_URL+`/api/tasks/taskapprovals/${taskId}`, {
                status: 'In Progress',
                endDate: new Date().toISOString() // Set end date to current date/time
            });

            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Handle successful response
            generateLog(taskId, 'approved_postponed');
            console.log('Task approved successfully');
            toast.dismiss()
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
    const generateLog = (taskId, action)=>{
        const data = {
            userId:userData?.userId,
            taskId,
            action,
            userName:userData?.name,
            details:{
            }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/api/logs`,data )
        .then(res=>{
            console.log('res', res.data)
        }).catch((err)=>{
            toast.dismiss();
            toast.error('Internal Server Error');
        })
    }


    const handleReject = ()=>{
        const data = {
            remark: remarkForRejection
        }
        axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/reject_postponed`, data)
        .then((res)=>{
            generateLog(taskId, 'reject_postponed');
            onClose(true);
            toast.dismiss();
            toast.success('Reject postponed');
        }).catch((err)=>{
            toast.dismiss();
            toast.error('Internal server error');
        })
    }

    return (
        <div>
            <div class=" max-w-full   ">
                <div class="border-b px-6 py-4">
                    <h3 class="text-lg font-semibold text-gray-800">Task Date Approved</h3>
                </div>
                <div class="space-y-6 px-6 py-2 text-gray-800">
                    <div class="grid grid-cols-2 gap-4">
                        <div> 
                            <h4 class="text-sm font-medium">Task Member</h4>
                            <p class="text-gray-500 ">{task?.people.map(person => person?.name).join(', ')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium">Remark</h4>
                            <p className="text-gray-500 ">
                                {task.remark && task.remark.length > 0 ? task.remark[0].text : 'No remarks available'}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium">New Date</h4>
                            <p className="text-gray-500 ">
                                {task.remark && task.remark.length > 0 ? task.remark[0].date : 'No date available'}
                            </p>
                        </div>
                    </div>

                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Remarks for Rejection</h3>
                    <textarea
                        value={remarkForRejection}
                        onChange={(e) => setRemarkForRejection(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mt-2"
                        placeholder="Enter remarks for rejection"
                        rows="4"
                    ></textarea>
                </div>
                <div class="flex justify-between gap-2 border-t px-6 py-4">
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                        disabled={isLoading}
                        onClick={() => handleReject()}
                    >
                        Reject
                    </button>
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
                        onClick={handleApprove}
                        disabled={isLoading}
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AcceptApprovals;

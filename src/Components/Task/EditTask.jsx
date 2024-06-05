import { Autocomplete } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const top100Films = [
    // Your top100Films array here...
];

function EditTask({ setedit, Taskid }) {
    const [GroupData, setGrouptData] = useState([]);
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [userid, setuserid] = useState("");
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        owner: { id: "" },
        taskGroup: '',
        taskName: '',
        description: '',
        audioFile: '',
        startDate: '',
        endDate: '',
        reminder: '',
        people: [],
    });
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    console.log("taskID", Taskid)
    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            console.log("userid:", userId);
            setuserid(userId);
        }
    }, []);

    useEffect(() => {
        if (userid) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                owner: { id: userid },
            }));
        }
    }, [userid]);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (Taskid) {
                try {
                    const response = await axios.get(`https://3.85.170.118:5000/api/tasks/${Taskid}`);
                    setFormData(response.data);
                    console.log(response.data)
                } catch (error) {
                    console.error("Error fetching task data:", error);
                }
            }
        };

        fetchTaskData();
    }, [Taskid]);

    const handleChange = (fieldName, value) => {
        if (fieldName === 'people') {
            const selectedUsers = value.map((name) => {
                return selectmembers.find((member) => member.name === name);
            });
            setFormData((prevFormData) => ({
                ...prevFormData,
                [fieldName]: selectedUsers,
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [fieldName]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`https://3.85.170.118:5000/api/tasksedit/${Taskid}`, formData);
            console.log(response.data);
            setedit(false);
            toast.success("Task updated successfully!");
            setInterval(
                () => {
                    window.location.reload();
                }, 1000
            )
        } catch (error) {
            console.error("Error updating task:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error("Error: " + error.response.data.error);
            } else {
                toast.error("Failed to update task. Please try again later.");
            }
        }
    };

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('https://3.85.170.118:5000/api/groups');
                setGrouptData(response.data);
            } catch (error) {
                console.log("Error fetching group data: ", error);
            }
        };

        fetchGroupData();
    }, []);

    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get("https://3.85.170.118:5000/api/userData");
                setUserNamesEmail(response.data);
                const filteredDepartmentHeads = response.data.filter((user) => user.userRole === 1);
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectLead = response.data.filter((user) => user.userRole === 2);
                setProjectLead(filteredProjectLead);
                const filterMember = response.data.filter((user) => user.userRole === 3);
                setMembers(filterMember);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRegisteredNames();
    }, []);

    return (
        <div>
            <div className="w-full max-w-3xl mx-auto p-6 md:p-8 lg:p-10 bg-gray-200 text-black rounded-lg shadow-lg">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="group-name">
                                Group Name
                            </label>
                            <select
                                className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={formData.taskGroup}
                                onChange={(e) => handleChange('taskGroup', e.target.value)}
                            >
                                <option value="">Select a Group</option>
                                {Array.isArray(GroupData) && GroupData.length > 0 ? (
                                    GroupData.map((group) => (
                                        <option key={group._id} value={group.groupName}>
                                            {group.groupName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No groups available</option>
                                )}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="task-name">
                                Task Name
                            </label>
                            <input
                                className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                id="task-name"
                                value={formData.taskName}
                                onChange={(e) => handleChange('taskName', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="task-description">
                            Task Description
                        </label>
                        <textarea
                            className="flex min-h-[80px] bg-gray-300 text-black w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            id="task-description"
                            rows="4"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center gap-4">
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" x2="12" y1="19" y2="22"></line>
                            </svg>
                            Record
                        </button>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" x2="12" y1="15" y2="3"></line>
                            </svg>
                            Upload
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="start-date">
                                Start Date
                            </label>
                            <input
                                className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                type="date"
                                id="start-date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="end-date">
                                End Date
                            </label>
                            <input
                                className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                type="date"
                                id="end-date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="reminder">
                            Reminder
                        </label>
                        <input
                            className="flex h-10 w-full bg-gray-300 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            type="time"
                            id="reminder"
                            value={formData.reminder}
                            onChange={(e) => handleChange('reminder', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="people">
                            People
                        </label>
                        <Autocomplete
                            multiple
                            id="people"
                            options={selectmembers.map((member) => member.name)}
                            value={formData.people.map((person) => person.name)}
                            onChange={(event, newValue) => {
                                handleChange('people', newValue);
                            }}
                            renderInput={(params) => (
                                <div ref={params.InputProps.ref}>
                                    <input
                                        style={{ backgroundColor: '#D1D5DB' }}
                                        type="text"
                                        {...params.inputProps}
                                    />
                                </div>
                            )}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-black text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Update Task
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditTask;

import { Autocomplete, Button, Input, Option, Select } from '@mui/joy'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function AddTask({ setOpen }) {
    const [GroupData, setGrouptData] = useState("")
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [userid, setuserid] = useState("")
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [formData, setFormData] = useState([])
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            console.log("userid:", userId);
            setuserid(userId);
        }
    }, []);

    useEffect(() => {
        // Function to get current date in "YYYY-MM-DD" format


        setFormData({
            owner: { id: userid },
            taskGroup: '',
            taskName: '',
            description: '',
            audioFile: '',
            startDate: '',
            endDate: '',
            reminder: '',
            people: [],
            // createdAt: getCurrentDate(), // Add createdAt field with current date
        });
    }, [userid]); // Trigger the effect whenever userid changes




    const handleChange = (fieldName, value) => {
        if (fieldName === 'people') {
            // Map selected user names to corresponding user objects
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
            const response = await axios.post("https://3.85.170.118:5000/api/tasksadd", formData);
            console.log(response.data);
            resetForm();
            setOpen(false)
            toast.success("Task created successfully!");
            setInterval(() => {
                window.location.reload();
            }, 1000)
        } catch (error) {
            console.error("Error creating group:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error("Error: " + error.response.data.error);
            } else {
                toast.error("Failed to create group. Please try again later.");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            owner: '',
            taskGroup: '',
            taskName: '',
            description: '',
            audioFile: '',
            startDate: '',
            endDate: '',
            reminder: '',
            people: [],
        });
    };
    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get('https://3.85.170.118:5000/api/groups');
                setGrouptData(response.data);
                console.log("groupdata", response.data)
            } catch (error) {
                console.log("Error fetching Task: ", error);
            }
        };

        fetchGroupData();
    }, []);
    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get("https://3.85.170.118:5000/api/userData");
                setUserNamesEmail(response.data);
                const filteredDepartmentHeads = response.data.filter(
                    (user) => user.userRole === 1
                );
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectlead = response.data.filter(
                    (user) => user.userRole === 2
                );
                setProjectLead(filteredProjectlead);
                const filtermember = response.data.filter(
                    (user) => user.userRole === 3
                );
                setMembers(filtermember);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                // setError("Internal Server Error");
                // setLoading(false);
            }
        };

        fetchRegisteredNames();
    }, []);
    console.log("selectmembers" , selectmembers)
    return (
        <div >
            <div class="w-full bg-gray-200 text-black rounded-lg">
                <div class="max-w-4xl mx-auto p-0 md:p-10">
                    <h1 class="text-2xl font-bold mb-6">Create New Task</h1>
                    <form class="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="location"
                            >
                                Group
                            </label>

                            <select
                                className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <div>
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="task-name"
                            >
                                Task Name
                            </label>
                            <input
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="task-name"
                                placeholder="Enter task name"
                                name="taskName"
                                value={formData.taskName}
                                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                            />
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="task-description"
                            >
                                Task Description
                            </label>
                            <textarea
                                class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-32"
                                id="task-description"
                                placeholder="Describe the task"
                                name="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div class="col-span-1 md:col-span-2">
                            <Autocomplete
                                placeholder="Search Members"
                                renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                                options={selectmembers.map((lead) => lead.name)}
                                onChange={(e, value) => handleChange('people', value)} // Ensure 'people' is passed as fieldName
                                multiple
                            />


                        </div>
                        <div>
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="start-date"
                            >
                                Start Date
                            </label>
                            <input
                                name="startDate"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className='inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start text-left font-normal' type="date" />

                        </div>
                        <div>
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="end-date"
                            >
                                End Date
                            </label>

                            <input className='inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start text-left font-normal'
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}

                            />
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <label
                                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="reminder"
                            >
                                Reminder
                            </label>
                            <div class="flex items-center gap-4">
                                <input className='inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2  justify-start text-left font-normal' type="time"
                                    name="reminder"
                                    value={formData.reminder}
                                    onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                                />
                            </div>
                        </div>
                        <div class="col-span-1 md:col-span-2">
                            <button onClick={handleSubmit} class="inline-flex bg-black text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium  hover:bg-primary/90 h-10 px-4 py-2 w-full">
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default AddTask

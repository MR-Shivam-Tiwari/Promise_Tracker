import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Import Quill
import { EditorProvider } from 'react-simple-wysiwyg';
import { Autocomplete } from '@mui/joy';
import { UserContext } from '../../global/UserContext';



function AddTask({ setOpen }) {
    const {userData} = useContext(UserContext)
    const [GroupData, setGroupData] = useState([]);
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [userid, setUserid] = useState("");
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectMembers, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        owner: { id: '' },
        taskGroup: { groupName: '', groupId: '' },
        taskName: '',
        description: '',
        audioFile: '',
        startDate: '',
        endDate: '',
        reminder: '',
        people: [],
    });


    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            console.log("userid:", userId);
            setUserid(userId);
            setFormData((prevFormData) => ({
                ...prevFormData,
                owner: { id: userId }
            }));
        }
    }, []);

    const handleChange = (fieldName, value) => {
        if (fieldName === 'people') {
            // Map selected user names to corresponding user objects
            const selectedUsers = value.map((name) => {
                return selectMembers.find((member) => member.name === name);
            });
            setFormData((prevFormData) => ({
                ...prevFormData,
                [fieldName]: selectedUsers,
            }));
        } else if (fieldName === 'taskGroup') {
            const [groupName, groupId] = value.split('||');
            setFormData((prevFormData) => ({
                ...prevFormData,
                taskGroup: { groupName, groupId },
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

        const { taskGroup, taskName, description, startDate, endDate } = formData;

        // Check if any field is empty
        if (!taskGroup.groupId || !taskName || !description || !startDate || !endDate) {
            toast.error('Please fill in all fields.');
            return; // Exit the function
        }

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+"/api/tasksadd", formData);
            console.log(response.data);
            generateAddTaskLog(response.data.taskId, formData)
            // resetForm();
            setOpen(false);
            toast.dismiss()
            toast.success("Task created successfully!");
            // setInterval(() => {
            //     window.location.reload();
            // }, 1000);
        } catch (error) {
            console.error("Error creating group:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.dismiss()
                toast.error("Error: " + error.response.data.error);
            } else {
                toast.dismiss()
                toast.error("Failed to create group. Please try again later.");
            }
        }
    };

    const generateAddTaskLog = (taskId, formData)=>{
        const data = {
            userId:userData?.userId,
            taskId,
            action:"create",
            userName:userData?.userName,
            details:{
                member:[...formData.people],
            }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/api/logs`,data )
        .then(res=>{
            resetForm();
            console.log('res', res.data)
        }).catch((err)=>{
            toast.dismiss();
            toast.error('Internal Server Error');
        })
    }

    const resetForm = () => {
        setFormData({
            owner: { id: userid },
            taskGroup: { groupName: '', groupId: '' },
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
                const response = await axios.get(process.env.REACT_APP_API_URL+'/api/groups');
                setGroupData(response.data);
                console.log("groupdata", response.data);
            } catch (error) {
                console.log("Error fetching Task: ", error);
            }
        };

        fetchGroupData();
    }, []);

    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL+"/api/userData");
                const filteredDepartmentHeads = response.data.filter(
                    (user) => user.userRole === 1
                );
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectlead = response.data.filter(
                    (user) => user.userRole === 2
                );
                setProjectLead(filteredProjectlead);
                const filterMember = response.data.filter(
                    (user) => user.userRole === 3
                );
                setMembers(filterMember);

            } catch (error) {
                console.error("Error fetching data:", error);
                // setError("Internal Server Error");
                // setLoading(false);
            }
        };

        fetchRegisteredNames();
    }, []);
    return (
        <div>
            <div className="w-full bg-gray-200 text-black lg:rounded-lg rounded-[3px]">
                <div className="max-w-4xl mx-auto p-0 md:p-10">
                    <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="location"
                            >
                                Group
                            </label>

                            <select
                                className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={`${formData.taskGroup.groupName || ''}||${formData.taskGroup.groupId || ''}`}
                                onChange={(e) => handleChange('taskGroup', e.target.value)}
                            >
                                <option value="">Select a Group</option>
                                {Array.isArray(GroupData) && GroupData.length > 0 ? (
                                    GroupData.map((group) => (
                                        <option key={group._id} value={`${group.groupName}||${group._id}`}>
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
                                className="text-sm font-medium  leading-none"
                                htmlFor="task-name"
                            >
                                Task Name <span className="text-red-500 ">*</span>
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md bg-white border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="task-name"
                                placeholder="Enter task name"
                                name="taskName"
                                value={formData.taskName}
                                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 mb-5">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="task-description"
                            >
                                Task Description
                            </label>
                            <ReactQuill
                                value={formData.description}
                                onChange={(value) => handleChange('description', value)}
                                className='rounded bg-white h-[100px] mb-5'
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                        { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <Autocomplete
                                placeholder="Assign to"
                                renderInput={(params) => <input {...params} className="flex w-full  items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                                options={selectMembers.map((lead) => lead.name)}
                                onChange={(e, value) => handleChange('people', value)} // Ensure 'people' is passed as fieldName
                                multiple
                            />
                        </div>
                        <div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="start-date"
                            >
                                Start Date
                            </label>
                            <input
                                name="startDate"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start text-left font-normal"
                                type="date"
                            />
                        </div>
                        <div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="end-date"
                            >
                                End Date
                            </label>

                            <input
                                className="inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-start text-left font-normal"
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            {/* <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="reminder"
                            >
                                Reminder
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    className="inline-flex items-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-start text-left font-normal"
                                    type="time"
                                    name="reminder"
                                    value={formData.reminder}
                                    onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
                                />
                            </div> */}
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <button
                                onClick={handleSubmit}
                                className="inline-flex bg-black text-white items-center justify-center whitespace-nowrap rounded-md text-sm font-medium hover:bg-primary/90 h-10 px-4 py-2 w-full"
                            >
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTask;

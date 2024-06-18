import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DragAndDropComponent from './Task Mange/DragAndDropComponent';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/joy';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import { Autocomplete } from '@mui/joy';
import Add from '@mui/icons-material/Add';

function Task() {
    const [tasks, setTasks] = useState([]);
    const [userid, setUserid] = useState('');
    const selectedDateRef = useRef(null);
    const [tasksToDo, setTasksToDo] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [tasksCancelled, setTasksCancelled] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allTasks, setAllTasks] = useState([]);
    const [taskGroups, setTaskGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [modal, setModal] = useState(false);
    const [groupData, setGroupData] = useState([]);
    const [departmentHeads, setDepartmentHeads] = useState([]);
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
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setUserid(userId);
            setFormData((prevFormData) => ({
                ...prevFormData,
                owner: { id: userId }
            }));
        }
    }, []);

    const handleChange = (fieldName, value) => {
        if (fieldName === 'people') {
            const selectedUsers = value.map((name) => {
                return selectMembers.find((member) => member.name === name);
            });
            setFormData((prevFormData) => ({
                ...prevFormData,
                [fieldName]: selectedUsers,
            }));
        } else if (fieldName === 'taskGroup') {
            if (value) {
                const [groupName, groupId] = value.split('||');
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    taskGroup: { groupName, groupId },
                }));
            } else {
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    taskGroup: { groupName: '', groupId: '' },
                }));
            }
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

        if (!taskGroup.groupId || !taskName || !description || !startDate || !endDate) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post("https://ptb.insideoutprojects.in/api/tasksadd", formData);
            console.log(response.data);
            resetForm();
            setModal(false);
            toast.success("Task created successfully!");
            await fetchTasks(); // Refetch tasks after creating a new one
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

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

    const fetchGroupData = async () => {
        try {
            const response = await axios.get('https://ptb.insideoutprojects.in/api/groups');
            setGroupData(response.data);
            console.log("groupData", response.data);
        } catch (error) {
            console.log("Error fetching Task: ", error);
        }
    };

    const fetchRegisteredNames = async () => {
        try {
            const response = await axios.get("https://ptb.insideoutprojects.in/api/userData");
            const filteredDepartmentHeads = response.data.filter(user => user.userRole === 1);
            setDepartmentHeads(filteredDepartmentHeads);
            const filteredProjectlead = response.data.filter(user => user.userRole === 2);
            setProjectLead(filteredProjectlead);
            const filterMember = response.data.filter(user => user.userRole === 3 || user.userRole === 2 || user.userRole === 1);
            setMembers(filterMember);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get('https://ptb.insideoutprojects.in/api/tasks');
            const userTasks = response.data.filter(task => {
                const isOwner = task.owner.id === userid;
                const isPerson = task.people.some(person => person.userId === userid);
                return isOwner || isPerson;
            });
            setTasks(userTasks);
            setAllTasks(userTasks);
            const todoTasks = userTasks.filter(task => !task.status || task.status === 'To Do');
            const inProgressTasks = userTasks.filter(task => task.status === 'In Progress');
            const completedTasks = userTasks.filter(task => task.status === 'Completed');
            const cancelledTasks = userTasks.filter(task => task.status === 'Cancelled');
            setTasksToDo(todoTasks);
            setTasksInProgress(inProgressTasks);
            setTasksCompleted(completedTasks);
            setTasksCancelled(cancelledTasks);
            const uniqueTaskGroups = [...new Set(userTasks.map(task => task?.taskGroup?.groupName))];
            setTaskGroups(uniqueTaskGroups);
            setLoading(false);
            await axios.put('https://ptb.insideoutprojects.in/api/archiveOldTasks');
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
        fetchRegisteredNames();
    }, []);

    useEffect(() => {
        if (userid) {
            fetchTasks();
        }
    }, [userid]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const groupName = searchParams.get('groupName');
        if (groupName) {
            setSelectedGroup(groupName);
        }
    }, [location.search]);

    useEffect(() => {
        if (selectedGroup !== '') {
            const filteredTasks = allTasks.filter(task => task?.taskGroup?.groupName === selectedGroup);
            setTasksToDo(filteredTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(filteredTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(filteredTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(filteredTasks.filter(task => task.status === 'Cancelled'));
        } else {
            setTasksToDo(allTasks.filter(task => !task.status || task.status === 'To Do'));
            setTasksInProgress(allTasks.filter(task => task.status === 'In Progress'));
            setTasksCompleted(allTasks.filter(task => task.status === 'Completed'));
            setTasksCancelled(allTasks.filter(task => task.status === 'Cancelled'));
        }
    }, [selectedGroup, allTasks]);

    const toggleModal = () => {
        setModal(!modal);
    };

    return (
        <div>
            <div className="flex flex-col h-full bg-white rounded text-black">
                <div className='flex items-center justify-between px-2'>
                    <div className='font-bold flex gap-3'>
                        <Button onClick={toggleModal} startDecorator={<Add />} variant='outlined' className='font-bold bg-blue-400 text-black  border-blue-400 border-2'>Add Tasks</Button>
                    </div>
                    <div className='flex items-center gap-3 text-lg font-bold'>
                        <Button onClick={() => navigate('/unapproved-task')} variant='outlined' className='font-bold bg-yellow-400 text-black bh-white border-yellow-400 border-2'> Unapproved Task</Button>
                        <Button onClick={() => navigate('/archive-task')} variant='outlined' className='font-bold bg-red-400 text-black bh-white border-red-400 border-2'> Archive Task</Button>

                        <p>Filter By Groups</p>
                        {taskGroups.length > 0 && (
                            <Select value={selectedGroup} className='font-bold' onChange={(event, newValue) => setSelectedGroup(newValue)}>
                                <Option value="" className='font-bold'>All Tasks</Option>
                                {taskGroups.map((group, index) => (
                                    <Option className='font-bold text-gray-400' key={index} value={group}>
                                        {group}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </div>
                    {modal && (
                        <div> 
                            <div
                                id="default-modal"
                                tabIndex="-1"
                                aria-hidden="true"
                                className="fixed inset-0 flex items-center justify-center z-50 w-full p-4 overflow-x-hidden overflow-y-auto max-h-full"
                            >
                                <div className="relative w-full max-w-4xl max-h-full">
                                    <div className="relative bg-white rounded-lg shadow ">
                                        <button
                                            type="button"
                                            onClick={toggleModal}
                                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                                            data-modal-hide="default-modal"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                className="w-5 h-5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                        <div className="px-6 py-6 lg:px-8">
                                            <h3 className="mb-4 text-xl font-medium text-gray-900 ">
                                                Add Task
                                            </h3>
                                            <form className="space-y-6" onSubmit={handleSubmit}>
                                                <div className='grid grid-cols-2 gap-3'>
                                                    <div>
                                                        <label htmlFor="taskname" className="block mb-2 text-sm font-medium text-gray-900 ">
                                                            Task Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="taskname"
                                                            id="taskname"
                                                            value={formData.taskName}
                                                            onChange={(e) => handleChange('taskName', e.target.value)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="Task Name"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="taskGroup" className="block mb-2 text-sm font-medium text-gray-900">
                                                            Task Group
                                                        </label>
                                                        <select
                                                            className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            value={`${formData.taskGroup.groupName || ''}||${formData.taskGroup.groupId || ''}`}
                                                            onChange={(e) => handleChange('taskGroup', e.target.value)}
                                                        >
                                                            <option value="">Select a Group</option>
                                                            {Array.isArray(groupData) && groupData.length > 0 ? (
                                                                groupData.map((group) => (
                                                                    <option key={group._id} value={`${group.groupName}||${group._id}`}>
                                                                        {group.groupName}
                                                                    </option>
                                                                ))
                                                            ) : (
                                                                <option value="" disabled>No groups available</option>
                                                            )}
                                                        </select>
                                                    </div>

                                                </div>
                                                <div>
                                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 ">
                                                        Description
                                                    </label>
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={formData.description}
                                                        onChange={(value) => handleChange('description', value)}
                                                        required
                                                    />
                                                </div>
                                                <div className='grid grid-cols-2 gap-3'>
                                                    <div>
                                                        <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-gray-900 ">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="startDate"
                                                            id="startDate"
                                                            value={formData.startDate}
                                                            onChange={(e) => handleChange('startDate', e.target.value)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="Start Date"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-gray-900 ">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="endDate"
                                                            id="endDate"
                                                            value={formData.endDate}
                                                            onChange={(e) => handleChange('endDate', e.target.value)}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="End Date"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="people" className="block mb-2 text-sm font-medium text-gray-900 ">
                                                        Select Members
                                                    </label>
                                                    <Autocomplete
                                                    placeholder="Assign to"
                                                        multiple
                                                        options={selectMembers.map((option) => option.name)}
                                                        onChange={(event, newValue) => handleChange('people', newValue)}
                                                        value={formData.people.map((person) => person.name)}
                                                        renderInput={(params) => (
                                                            <input
                                                                {...params}
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                                placeholder="Select Members"
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                                >
                                                    Submit
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
                        </div>
                    )}
                </div>
                <div className="flex-grow overflow-y-auto">
                    <DragAndDropComponent
                        tasksToDo={tasksToDo}
                        tasksInProgress={tasksInProgress}
                        tasksCompleted={tasksCompleted}
                        tasksCancelled={tasksCancelled}
                        fetchTasks={fetchTasks}
                        setTasksToDo={setTasksToDo}
                        setTasksInProgress={setTasksInProgress}
                        setTasksCompleted={setTasksCompleted}
                        setTasksCancelled={setTasksCancelled}
                        allTasks={allTasks}
                    />
                </div>
            </div>
        </div>
    );
}

export default Task;

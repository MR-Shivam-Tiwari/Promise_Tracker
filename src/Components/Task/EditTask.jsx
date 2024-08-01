import { Autocomplete } from '@mui/joy';
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from '../../global/UserContext';
import ReactQuill from 'react-quill';
import { CircularProgress } from '@mui/material';

const top100Films = [
    // Your top100Films array here...
];

function EditTask({ data, setEdit }) {
    const Taskid = data?._id
    const { userData } = useContext(UserContext)
    const [GroupData, setGrouptData] = useState([]);
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [userid, setuserid] = useState("");
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLoader, setAudioLoader] = useState(false)
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [audioUrl, setAudioUrl] = useState('');

    const [formData, setFormData] = useState({
        owner: data?.owner,
        taskGroup: data?.taskGroup,
        taskName: data?.taskName,
        description: data?.description,
        audioFile: data?.audioFile,
        startDate: data?.startDate,
        endDate: data?.endDate,
        reminder: data?.reminder,
        people: data?.people,
        pdfFile: data?.pdfFile,
    });
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    const [uploadResultVoice, setuploadResultVoice] = useState(formData?.audioFile);
    const [singleFile, setSingleFile] = useState(formData?.pdfFile);

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
                    const response = await axios.get(process.env.REACT_APP_API_URL + `/api/tasks/${Taskid}`);
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
    const generateAddTaskLog = (taskId, formData) => {
        const data = {
            userId: userData?.userId,
            taskId,
            action: "edit",
            userName: userData?.name,
            details: {
                member: [...formData.people],
            }
        }
        axios.post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
            .then(res => {
                console.log('res', res.data)
            }).catch((err) => {
                toast.dismiss();
                toast.error('Internal Server Error');
            })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(process.env.REACT_APP_API_URL + `/api/tasksedit/${Taskid}`, { ...formData, audioFile: uploadResultVoice, pdfFile: singleFile });
            console.log(response.data);
            generateAddTaskLog(response.data._id, formData)
            setEdit(false)
            toast.dismiss()
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
                const response = await axios.get(process.env.REACT_APP_API_URL + '/api/groups');
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
                const response = await axios.get(process.env.REACT_APP_API_URL + "/api/userData");
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
    const startRecording = async () => {
        setIsRecording(true);
        audioChunksRef.current = [];

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                await uploadAudio(audioBlob);
            };
            mediaRecorderRef.current.start();
        } catch (error) {
            console.error('Error starting recording:', error);
            setIsRecording(false);
        }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    const uploadSingleFile = async (file) => {
        if (!file) {
            // setUploadResult('No file selected.');
            toast.dismiss();
            toast.error('Please select an file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSingleFile(response.data.result);
            toast.dismiss();
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error(error.response?.data?.error || error.message);
        }
    }

    const handleFileSelect = (event) => {
        event.preventDefault();
        event.stopPropagation();
        uploadSingleFile(event.target.files[0]);
    };
    const handleUploadClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById("image-upload").click();
    };

    const uploadAudio = async (audioBlob) => {
        setAudioLoader(true);
        console.log('alsjdfklsajfdlkafjdslkaf', audioBlob)
        const formData = new FormData();
        formData.append('voice', audioBlob, 'recording.wav');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-voice`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAudioLoader(false);

            setuploadResultVoice(response.data.result);
        } catch (error) {
            setAudioLoader(false);
        }
    };

    return (
        <div>
            <div>
                <h1 className='text-2xl px-4 py-4 font-bold'>Edit Task</h1>
            </div>
            <div className="w-full max-w-3xl h-[80vh] overflow-scroll mx-auto p-6 md:p-8 lg:p-10 bg-white text-black lg:rounded-lg rounded-[3px] shadow-lg">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="group-name">
                                Group Name
                            </label>
                            <select
                                className="flex bg-white h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                value={JSON.stringify(formData?.taskGroup || { groupId: "", groupName: "" })}
                                onChange={(e) => {
                                    const selectedGroup = JSON.parse(e.target.value);
                                    handleChange('taskGroup', selectedGroup);
                                }}
                            >
                                <option value={JSON.stringify({ groupId: "", groupName: "" })}>Select a Group</option>
                                {
                                    GroupData.map((group) => (
                                        <option
                                            key={group?._id}
                                            value={JSON.stringify({ groupId: group?._id, groupName: group.groupName })}
                                        >
                                            {group.groupName}
                                        </option>
                                    ))
                                }
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

                        <ReactQuill
                            value={formData.description}
                            onChange={(value) => handleChange('description', value)}
                            className='rounded bg-white h-full mb-5'
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
                    <div className="p-4  bg-white lg:rounded-lg rounded-[3px] shadow-md">
                        <label htmlFor="taskname" className="block mb-4 text-lg font-semibold text-gray-900">
                            Record Audio
                        </label>
                        <div className="flex space-x-4 mb-4 items-center">
                            <button
                                onClick={startRecording}
                                disabled={isRecording}
                                className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.414-1.414A5.987 5.987 0 016 12H4c0 2.21.895 4.21 2.291 5.291z"></path>
                                        </svg>
                                        Recording...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 2a2 2 0 00-2 2v4a2 2 0 004 0V4a2 2 0 00-2-2zM5 4a3 3 0 116 0v4a3 3 0 11-6 0V4z" />
                                            <path d="M11.5 10.5a.5.5 0 01-1 0 .5.5 0 011 0zM4.5 10.5a.5.5 0 01-1 0 .5.5 0 011 0zM8 1a1 1 0 011 1v4a1 1 0 01-2 0V2a1 1 0 011-1zM6.5 8a1.5 1.5 0 103 0v-1a1.5 1.5 0 10-3 0v1z" />
                                        </svg>
                                        {uploadResultVoice ? 'Record Again' : 'Start Recording'}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={stopRecording}
                                disabled={!isRecording}
                                className={`flex items-center px-4 py-2 text-white font-medium lg:rounded-lg rounded-[3px] focus:outline-none ${!isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M5.5 4a.5.5 0 00-.5.5v7a.5.5 0 001 0v-7a.5.5 0 00-.5-.5zM10.5 4a.5.5 0 00-.5.5v7a.5.5 0 001 0v-7a.5.5 0 00-.5-.5zM8 1a1 1 0 00-1 1v2a1 1 0 002 0V2a1 1 0 00-1-1zM6.5 7a1.5 1.5 0 113 0v1a1.5 1.5 0 11-3 0V7z" />
                                </svg>
                                Stop Recording
                            </button>
                        </div>


                        {
                            audioLoader ? <div className='flex justify-start'><CircularProgress /></div>
                                : uploadResultVoice ? <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Playback:</h3>
                                    <audio controls src={uploadResultVoice} className="w-full mb-2"></audio>
                                    <button
                                        // onClick={removeRecording} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setuploadResultVoice(null);
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white font-medium lg:rounded-lg rounded-[3px] hover:bg-red-600 focus:outline-none"
                                    >
                                        Remove Recording
                                    </button>
                                </div> : null
                        }
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-4'>
                        <div className="p-4">
                            <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">
                                Upload File
                            </label>
                            <input
                                accept="file/*"
                                id="image-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                            <button
                                onClick={handleUploadClick}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-upload mr-2"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M.5 9.9a.5.5 0 0 1 .5-.4h4.5v-8a.5.5 0 0 1 1 0v8h4.5a.5.5 0 0 1 .4.6l-1.5 3.5a.5.5 0 0 1-.9 0L7 11.5H2.9l-1.4 3.5a.5.5 0 0 1-.9 0l-1.5-3.5a.5.5 0 0 1-.1-.1z" />
                                    <path fillRule="evenodd" d="M4.5 6V.5A.5.5 0 0 1 5 0h1a.5.5 0 0 1 .5.5V6h1.5a.5.5 0 0 1 .4.6L7 9.5H5l-1.5-2.9a.5.5 0 0 1 .1-.6H4.5z" />
                                </svg>
                                Upload
                            </button>
                            {singleFile && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Uploaded File:</h3>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            className="bi bi-file-earmark"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h4.5L14 4.5zM10 4a1 1 0 0 1-1-1V1.5L14 5h-3.5A1.5 1.5 0 0 1 9 3.5V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5H10z" />
                                        </svg>
                                        <a href={singleFile} className="ml-2 text-gray-700">File</a>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <label htmlFor="description" className="block mb-2 text-lg font-medium text-gray-900">
                                Change Status
                            </label>
                            <select disabled={data.status === "Completed"} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected>Choose a Status</option>
                                <option value="">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Postponed</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="start-date">
                                Start Date
                            </label>
                            <input
                                disabled={formData.status === "Cancelled"}

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
                                disabled={formData.status === "Cancelled"}
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

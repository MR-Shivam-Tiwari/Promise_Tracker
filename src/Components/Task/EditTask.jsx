import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// AutocompleteMultiSelect component
const AutocompleteMultiSelect = ({ options, selectedOptions, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedOptions.some((selected) => selected.userId === option.userId)
      )
    );
  }, [inputValue, options, selectedOptions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Search and select people"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option.userId}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange([...selectedOptions, option]);
                setInputValue("");
                setIsOpen(false);
              }}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <div
            key={option.userId}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
          >
            {option.name}
            <button
              onClick={() => onChange(selectedOptions.filter((o) => o.userId !== option.userId))}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main EditTask component
function EditTask({ data, setEdit, fetchTasks }) {
  const Taskid = data?._id;
  const { userData } = useContext(UserContext);
  const [GroupData, setGroupData] = useState([]);
  const [allMemberOfGroup, setAllMemberOfGroup] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLoader, setAudioLoader] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [formData, setFormData] = useState({
    owner: data?.owner || {},
    taskGroup: data?.taskGroup || {},
    taskName: data?.taskName || "",
    description: data?.description || "",
    audioFile: data?.audioFile || "",
    startDate: data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
    endDate: data?.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
    reminder: data?.reminder || "",
    people: data?.people || [],
    pdfFile: data?.pdfFile || "",
    status: data?.status || '',
  });

  const [initialFormData, setInitialData] = useState({ ...formData });
  const [uploadResultVoice, setUploadResultVoice] = useState(formData?.audioFile);
  const [singleFile, setSingleFile] = useState(formData?.pdfFile);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (Taskid) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/${Taskid}`);
          const taskData = response.data;
          setFormData({
            ...taskData,
            startDate: taskData.startDate ? new Date(taskData.startDate).toISOString().split('T')[0] : '',
            endDate: taskData.endDate ? new Date(taskData.endDate).toISOString().split('T')[0] : '',
            people: taskData.people || [],
          });
          setInitialData({
            ...taskData,
            startDate: taskData.startDate ? new Date(taskData.startDate).toISOString().split('T')[0] : '',
            endDate: taskData.endDate ? new Date(taskData.endDate).toISOString().split('T')[0] : '',
            people: taskData.people || [],
          });
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      }
    };

    fetchTaskData();
  }, [Taskid]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`);
        setGroupData(response.data);
      } catch (error) {
        console.error("Error fetching group data: ", error);
      }
    };

    fetchGroupData();
  }, []);

  useEffect(() => {
    const getAllMemberByGroup = async () => {
      if (formData?.taskGroup?.groupId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/members/${formData.taskGroup.groupId}`);
          const apiData = response.data;
          setAllMemberOfGroup([...apiData.members, ...apiData.deptHead, ...apiData.projectLead]);
        } catch (error) {
          console.error("Error fetching group members:", error);
        }
      }
    };

    getAllMemberByGroup();
  }, [formData?.taskGroup?.groupId]);

  const handleChange = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changes = getChanges(initialFormData, formData);
    console.log("Changes:", changes);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/tasksedit/${Taskid}`,
        { ...formData, audioFile: uploadResultVoice, pdfFile: singleFile }
      );
      generateAddTaskLog(response.data._id, formData, changes);
      setEdit(false);
      toast.dismiss();
      toast.success("Task updated successfully!");
      fetchTasks();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("Error: " + error.response.data.error);
      } else {
        toast.error("Failed to update task. Please try again later.");
      }
    }
  };

  const getChanges = (initialData, updatedData) => {
    const changes = {};
    for (const key in updatedData) {
      if (JSON.stringify(initialData[key]) !== JSON.stringify(updatedData[key])) {
        changes[key] = updatedData[key];
      }
    }
    return changes;
  };

  const generateAddTaskLog = (taskId, formData, changes) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action: "edit",
      userName: userData?.name,
      details: {
        member: [...formData.people],
        changes,
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("Log created:", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Error creating log");
      });
  };

  const startRecording = async (e) => {
    e.preventDefault();
    setIsRecording(true);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await uploadAudio(audioBlob);
      };
      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadSingleFile = async (file) => {
    if (!file) {
      toast.dismiss();
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSingleFile(response.data.result);
      setFormData((prevFormData) => ({
        ...prevFormData,
        pdfFile: response.data.result,
      }));
      toast.dismiss();
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleFileSelect = (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadSingleFile(event.target.files[0]);
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("file-upload").click();
  };

  const uploadAudio = async (audioBlob) => {
    setAudioLoader(true);
    const formData = new FormData();
    formData.append("voice", audioBlob, "recording.wav");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload-voice`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAudioLoader(false);
      setUploadResultVoice(response.data.result);
      setFormData((prevFormData) => ({
        ...prevFormData,
        audioFile: response.data.result,
      }));
    } catch (error) {
      setAudioLoader(false);
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div className="  p-6 h-[400px]  ">
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="group-name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <select
              id="group-name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData?.taskGroup?.groupId || ""}
              onChange={(e) => {  
                const selectedGroupId = e.target.value;
                const selectedGroup = GroupData.find(group => group._id === selectedGroupId);
                const data = {
                  groupName: selectedGroup?.groupName,
                  groupId: selectedGroup?._id
                }
                if (selectedGroup) {
                  handleChange("taskGroup", data);
                }
              }}
            >
              <option value="">Select a Group</option>
              {GroupData.map((group) => (
                <option key={group?._id} value={group?._id}>
                  {group?.groupName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-name" className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              id="task-name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.taskName}
              onChange={(e) => handleChange("taskName", e.target.value)}
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description
          </label>
          <ReactQuill
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            className="h-20"
          />
        </div>

        {/* <div className="space-y-2">
          <label htmlFor="audio-recording" className="block text-sm font-medium text-gray-700">
            Record Audio
          </label>
          <div className="flex space-x-4">
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`px-4 py-2 text-white font-medium rounded-md focus:outline-none ${
                isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isRecording ? "Recording..." : uploadResultVoice ? "Record Again" : "Start Recording"}
            </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`px-4 py-2 text-white font-medium rounded-md focus:outline-none ${
                !isRecording ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Stop Recording
            </button>
          </div>
          {audioLoader ? (
            <div className="flex justify-start">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : uploadResultVoice ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Playback:</h3>
              <audio controls src={uploadResultVoice} className="w-full mb-2"></audio>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setUploadResultVoice(null);
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    audioFile: null,
                  }));
                }}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none"
              >
                Remove
              </button>
            </div>
          ) : null}
        </div> */}

        <div className="mt-10" style={{marginTop:"50px"}}>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Upload
          </button>
          {singleFile && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Uploaded File:</h3>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <a href={singleFile} className="ml-2 text-blue-600 hover:underline">
                  View File
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            disabled={formData.status === "Completed"}
          >
            <option value="">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Postponed</option>
          </select>
        </div>

        <div>
          <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">
            People
          </label>
          <AutocompleteMultiSelect
            options={allMemberOfGroup}
            selectedOptions={formData.people}
            onChange={(selected) => handleChange("people", selected)}
          />
        </div>

        <button
          type="submit"
          style={{marginBottom:"30px"}}
          className="w-full  bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTask;


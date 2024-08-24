import { Autocomplete } from "@mui/joy";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import ReactQuill from "react-quill";
import { CircularProgress } from "@mui/material";

function EditTask({ data, setEdit, fetchTasks }) {
  const Taskid = data?._id;
  const { userData } = useContext(UserContext);
  const [GroupData, setGrouptData] = useState([]);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [userid, setuserid] = useState("");
  const [selectProjectLead, setProjectLead] = useState([]);
  const [selectmembers, setMembers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLoader, setAudioLoader] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioUrl, setAudioUrl] = useState("");

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
  const [uploadResultVoice, setuploadResultVoice] = useState(
    formData?.audioFile
  );
  const [singleFile, setSingleFile] = useState(formData?.pdfFile);

  console.log("taskID", Taskid);
  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
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
          const response = await axios.get(
            process.env.REACT_APP_API_URL + `/api/tasks/${Taskid}`
          );
          setFormData(response.data);
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      }
    };

    fetchTaskData();
  }, [Taskid]);

  const handleChange = (fieldName, value) => {
    if (fieldName === "people") {
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
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `/api/tasksedit/${Taskid}`,
        { ...formData, audioFile: uploadResultVoice, pdfFile: singleFile }
      );
      console.log(response.data);
      generateAddTaskLog(response.data._id, formData);
      setEdit(false);
      toast.dismiss();
      toast.success("Task updated successfully!");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("Error: " + error.response.data.error);
      } else {
        // toast.error("Failed to update task. Please try again later.");
      }
    }
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/api/groups"
        );
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
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/api/userData"
        );
        setUserNamesEmail(response.data);
        const filteredDepartmentHeads = response.data.filter(
          (user) => user.userRole === 1
        );
        setDepartmentHeads(filteredDepartmentHeads);
        const filteredProjectLead = response.data.filter(
          (user) => user.userRole === 2
        );
        setProjectLead(filteredProjectLead);
        const filterMember = response.data.filter(
          (user) => user.userRole === 3
        );
        setMembers(filterMember);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRegisteredNames();
  }, []);
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
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
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
      // setUploadResult('No file selected.');
      toast.dismiss();
      toast.error("Please select an file to upload.");
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
    document.getElementById("image-upload").click();
  };

  const uploadAudio = async (audioBlob) => {
    setAudioLoader(true);
    console.log("alsjdfklsajfdlkafjdslkaf", audioBlob);
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

      setuploadResultVoice(response.data.result);
    } catch (error) {
      setAudioLoader(false);
    }
  };

  return (
    <div >
      <div>
        <h1 className="text-2xl px-4 py-4 font-bold">Edit Task</h1>
      </div>
      <div className="w-full max-w-3xl lg:h-[80vh] overflow-scroll mx-auto p-6 md:p-8 lg:p-10 bg-white text-black lg:rounded-lg rounded-[3px] shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="group-name"
              >
                Group Name
              </label>
              <select
                className="flex bg-gray-50 h-10 w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm "
                value={JSON.stringify(
                  formData?.taskGroup || { groupId: "", groupName: "" }
                )}
                onChange={(e) => {
                  const selectedGroup = JSON.parse(e.target.value);
                  handleChange("taskGroup", selectedGroup);
                }}
              >
                <option value={JSON.stringify({ groupId: "", groupName: "" })}>
                  Select a Group
                </option>
                {GroupData.map((group) => (
                  <option
                    key={group?._id}
                    value={JSON.stringify({
                      groupId: group?._id,
                      groupName: group.groupName,
                    })}
                  >
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="task-name"
              >
                Task Name
              </label>
              <input
                className="flex h-10 w-full bg-gray-50 font-bold text-black rounded-md border border-input px-3 py-2 text-sm "
                id="task-name"
                value={formData.taskName}
                onChange={(e) => handleChange("taskName", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="task-description"
            >
              Task Description
            </label>

            <ReactQuill
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
              className="rounded bg-white h-full mb-5"
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
            />
          </div>
          <div className="p-4  bg-white lg:rounded-lg rounded-[3px] shadow-md">
            <label
              htmlFor="taskname"
              className="block mb-4 text-lg font-semibold text-gray-900"
            >
              Record Audio
            </label>
            <div className="flex space-x-4 mb-4 items-center">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`flex items-center px-4 py-2 text-white font-medium  rounded-[4px] focus:outline-none ${
                  isRecording
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isRecording ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.414-1.414A5.987 5.987 0 016 12H4c0 2.21.895 4.21 2.291 5.291z"
                      ></path>
                    </svg>
                    Recording...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-mic-fill mr-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                      <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                    </svg>
                    {uploadResultVoice ? "Record Again" : "Start Recording"}
                  </>
                )}
              </button>
              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className={`flex items-center px-4 py-2 text-white font-medium  rounded-[4px] focus:outline-none ${
                  !isRecording
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-stop-circle-fill mr-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z" />
                </svg>
                Stop Recording
              </button>
            </div>

            {audioLoader ? (
              <div className="flex justify-start">
                <CircularProgress />
              </div>
            ) : uploadResultVoice ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Playback:
                </h3>
                <audio
                  controls
                  src={uploadResultVoice}
                  className="w-full mb-2"
                ></audio>
                <button
                  // onClick={removeRecording}
                  onClick={(e) => {
                    e.preventDefault();
                    setuploadResultVoice(null);
                  }}
                  className="px-4 py-2 flex items-center gap-2 bg-red-500 text-white font-medium  rounded-[4px] hover:bg-red-600 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-x-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                  </svg>
                  Remove
                </button>
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div className="p-4">
              <label
                htmlFor="description"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Upload File
              </label>
              <input
                accept="file/*"
                id="image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bi bi-cloud-arrow-up-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
                </svg>
                Upload
              </button>
              {singleFile && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Uploaded File:
                  </h3>
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
                    <a href={singleFile} className="ml-2 text-gray-700">
                      File
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <label
                htmlFor="description"
                className="block mb-2 text-lg font-medium text-gray-900"
              >
                Change Status
              </label>
              <select
                disabled={data.status === "Completed"}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option selected disabled>
                  Choose a Status
                </option>
                <option value="">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Postponed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="start-date"
              >
                Start Date
              </label>
              <input
                disabled={formData.status === "Cancelled"}
                className="flex h-10 w-full bg-gray-50 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="date"
                id="start-date"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="end-date"
              >
                End Date
              </label>
              <input
                disabled={formData.status === "Cancelled"}
                className="flex h-10 w-full bg-gray-50 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                type="date"
                id="end-date"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            {/* <label
              className="text-sm font-medium leading-none"
              htmlFor="reminder"
            >
              Reminder
            </label> */}
            {/* <input
              className="flex h-10 w-full bg-gray-50 text-black rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              type="time"
              id="reminder"
              value={formData.reminder}
              onChange={(e) => handleChange("reminder", e.target.value)}
            /> */}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none"
              htmlFor="people"
            >
              People
            </label>
            <Autocomplete
              multiple
              id="people"
              options={selectmembers.map((member) => member.name)}
              value={formData.people.map((person) => person.name)}
              onChange={(event, newValue) => {
                handleChange("people", newValue);
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    style={{ backgroundColor: "#D1D5DB" }}
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

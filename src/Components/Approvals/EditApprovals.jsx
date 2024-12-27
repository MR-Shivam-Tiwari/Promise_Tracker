import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import { PreviewOutlined } from "@mui/icons-material";

function EditApprovals({ taskId, task, onClose }) {
  const { userData } = useContext(UserContext);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to convert base64 to Blob
  const base64ToBlob = (base64String, contentType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `/api/categoryedit/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryAction: "Approved",
            remark: remark,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle successful response
      generateLog(taskId, "approved");

      console.log("Task approved successfully");
      toast.dismiss();

      toast.success("Task approved successfully");
      onClose(true);
    } catch (error) {
      console.error("There was a problem with the request:", error);
      toast.error("There was a problem with the request:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const generateLog = (taskId, action) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action,
      userName: userData?.name,
      details: {},
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

  const handleUnapprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + `/api/categoryedit/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryAction: "Unapproved",
            remark: remark,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Handle successful response
      generateLog(taskId, "unapproved");
      console.log("Task unapproved successfully");
      toast.warn("Task unapproved successfully");
      onClose(true);
    } catch (error) {
      console.error("There was a problem with the request:", error);
      toast.error("There was a problem with the request:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  console.log("task", task);

  return (
    <div>
      <div>
        <div className="w-[600px] max-w-full mt-5 bg-gradient-to-br from-[#f0f0f0] to-[#d0d0d0] lg:rounded-lg rounded-[3px] shadow-lg">
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {task?.taskName}
            </h3>
          </div>
          <div className="space-y-6 px-6 py-8 text-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Task Member</h4>
                <p className="text-gray-500 ">
                  {task?.people.map((person) => person.name).join(", ")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Start Date</h4>
                <p className="text-gray-500 ">{task?.startDate}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">End Date</h4>
                <p className="text-gray-500 ">{task?.endDate}</p>
              </div>
            </div>
            <div>
              <h4 className="text-md font-bold px-2">Proof Of Work</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h6 className="text-sm font-medium mb-2">Text</h6>
                  <div className="border rounded bg-gray-300 p-2">
                    {task?.pow?.text || "No text provided"}
                  </div>
                </div>
                <div>
                  <h6 className="text-sm font-medium mb-2">Screenshot</h6>
                  <div className="flex items-end justify-between">
                    {task?.pow?.file ? (
                      <a
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
                        href={task.pow.file}
                        download
                      >
                        Download
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No file available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium">Remark</h4>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2 h-24 bg-white text-gray-800 placeholder:text-gray-500 focus:bg-gray-300"
                placeholder="Enter your remarks about the Task"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t px-6 py-4">
            {task?.category !== "Unapproved" && (
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300"
                onClick={handleUnapprove}
                disabled={isLoading}
              >
                Unapprove
              </button>
            )}
            {task?.category !== "Approved" && (
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
                onClick={handleApprove}
                disabled={isLoading}
              >
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditApprovals;

import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";

const CommentComponent = ({ data, getAllLogs }) => {
  const { userData } = useContext(UserContext);
  const [isOpenComment, setIsOpenComment] = useState(false); // State to control accordion open/close
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [commentForm, setCommentForm] = useState({
    taskId: data?._id,
    userId: userData?._id,
    text: "",
    file: null,
  });
  const [showModal, setShowModal] = useState(false); // Set default to false to hide the modal

  const getAllComments = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/comments/get/${data?._id}/allCommentByTask`
      )
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/comments/add`, commentForm)
      .then((res) => {
        toast.dismiss();
        toast.success("Comment added successfully");
        generateLog(data?._id, "create_comment");
        setShowModal(false); // Close modal after successful submission
        setCommentForm((prev) => ({ ...prev, text: "", file: null })); // Reset the form
        getAllComments(); // Refresh comments list
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const generateLog = (taskId, action) => {
    const data = {
      userId: userData?.userId,
      taskId,
      action,
      userName: userData?.name,
      details: {
        text: commentForm.text,
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/logs`, data)
      .then((res) => {
        console.log("res", res.data);
        getAllLogs();
      })
      .catch((err) => {
        toast.dismiss();
        toast.error("Internal Server Error");
        throw err; // Throw error to handle it properly in the calling function
      });
  };

  const generateImageLink = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setCommentForm((prev) => ({ ...prev, file: res.data.result }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllComments();
  }, []); // Empty dependency array to avoid infinite calls

  const toggleAccordionComments = () => {
    setIsOpenComment(!isOpenComment); // Toggle open/close state
  };

  const editModal = () => {};

  return (
    <>
      <div className="flex justify-between">
        <h3
          className="text-black text-lg mb-5 font-bold cursor-pointer"
          onClick={toggleAccordionComments} // Trigger accordion open/close on click
        >
          All Comments{" "}
          <span className="text-gray-500 font-bold text-md">
            ({comments?.length})
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {isOpenComment ? "▲" : "▼"}
          </span>
        </h3>
        {!data?.isSubtask && data?.status !== "Archive" && (
          <div>
            <button
              onClick={() => setShowModal(true)} // Open modal when clicked
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded text-sm"
            >
              Add Comment
            </button>
          </div>
        )}
      </div>

      {isOpenComment && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-md">
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  {comment.userId.profilePic && (
                    <img
                      className="w-full h-full object-cover"
                      alt="Profile"
                      src={comment.userId.profilePic}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 capitalize">
                      {comment.userId.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {moment(comment.createdAt).format(
                        "D MMMM YYYY [at] h:mm A"
                      )}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.text}</p>
                  {comment.file && (
                    <a
                      href={comment.file}
                      className="inline-block mt-2 text-sm font-medium text-blue-600 hover:underline"
                    >
                      Download File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg md:w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-4">Add Comment</h2>
            <form onSubmit={handleAddComment}>
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700">
                  Description <span className="text-red-600 ">*</span>
                </label>
                <textarea
                  value={commentForm.text}
                  onChange={(e) =>
                    setCommentForm({
                      ...commentForm,
                      text: e.target.value,
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-gray-700">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) => generateImageLink(e.target.files[0])}
                  className="mt-1 block w-full"
                />
                {commentForm.file && (
                  <p className="text-sm text-gray-500">
                    File: {commentForm.file}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-2 py-1 text-md font-normal bg-gray-500 text-white rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-md font-normal bg-blue-500 text-white rounded"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentComponent;

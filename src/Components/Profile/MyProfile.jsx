import * as React from "react";
import { useState, useEffect } from "react";

import IconButton from "@mui/joy/IconButton";

import { toast } from "react-toastify";
import axios from "axios";

import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { UserContext } from "../../global/UserContext";

export default function MyProfile() {
  const { userData, setUserData } = React.useContext(UserContext);

  const userDataString = localStorage.getItem("userData");
  const [userId, setUserId] = useState(
    JSON.parse(userDataString)?.userId || ""
  );
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const [role, setRole] = useState("");

  // Function to handle file selection
  const uploadNewImage = async (image) => {
    if (!image) {
      // setUploadResult('No file selected.');
      toast.dismiss();
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/change-proifle-pic/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // setUploadResult(`Image uploaded successfully: ${response.data.result}`);
      setUserData({ ...userData, profilePic: response.data.result });
      toast.dismiss();
      toast.success(response.data.message);
    } catch (error) {
      // setUploadResult(`Upload failed: ${error.response?.data?.error || error.message}`);
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.error || error.message);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    uploadNewImage( event.target.files[0]);
    // console.log(file)
  };

  // Function to handle upload button click
  const handleUploadClick = () => {
    document.getElementById("image-upload").click();
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      const data = {
        newPassword,
        oldPassword,
        userId,
      };
      axios
        .post(process.env.REACT_APP_API_URL+"/api/change-password", data)
        .then((res) => {
          toast.dismiss();
          toast.success("Password changed successfully");
        });
    } else {
      toast.dismiss();
      toast.error("New Password and Confirm Password should be the same");
    }
  };

  const handleUpdate = () => {
    const updatedData = {
      userId: userData?.userId,
      name,
      designation,
      email,
      mobilenumber,
      department,
      active,
      profilePic: userData?.profilePic,
    };

    axios
      .put(process.env.REACT_APP_API_URL+`/api/users/${userData?.userId}`, updatedData)
      .then((res) => {
        toast.dismiss();
        toast.success("Profile updated successfully");
        console.log("Response data:", res.data);
        setUserData({
          ...userData,
          name: res.data.name,
          profilePic: res.data.profilePic,
          email: res.data.email,
          mobilenumber: res.data.mobilenumber,
          department: res.data.department,
          active: res.data.active,
          designation: res.data.designation,
        });
      })
      .catch((error) => {
        toast.dismiss();
        toast.error("Failed to update profile");
        console.error("Error updating profile:", error);
      });
  };

  const getRole = (role) => {
    switch (role) {
      case 1:
        return "Dept Head";
      case 2:
        return "Project Head";
      case 3:
        return "Member";
      case 0:
        return "Super Admin";
      default:
        return "No Role";
    }
  };

  useEffect(() => {
    setRole(getRole(Number(userData?.userRole)));
  }, [userData]);

  const [section, setSection] = useState("about");

  const [name, setName] = useState(userData?.name);
  const [designation, setDesignation] = useState(userData?.designation);
  const [email, setEmail] = useState(userData?.email);
  const [mobilenumber, setMobilenumber] = useState(userData?.mobilenumber);
  const [department, setDepartment] = useState(userData?.department);
  const [active, setActive] = useState(userData?.active);

  const handleSave = () => {
    handleUpdate();
  };

  return (
    <>
      <div className="lg:p-6  bg-gray-50 min-h-screen">
      <div className=" bg-white shadow-b-lg ">
        <div className=" flex flex-col sm:flex-row items-center lg:p-4 p-2  gap-10 lg:px-10 px-0  rounded-t-lg">
          <div
            onClick={handleUploadClick}
            className="relative cursor-pointer group"
          >
            <div className="w-[190px] h-[190px]">
              <img
                src={userData?.profilePic}
                alt="Profile"
                className="w-full object-cover h-full rounded-md shadow-lg mr-6"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity lg:rounded-lg rounded-[3px]">
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <IconButton
                aria-label="upload new picture"
                size="large"
                component="span"
                variant="outlined"
                color="neutral"
                // onClick={handleUploadClick}
                className="text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                  />
                </svg>
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col justify-between items-start ">
            <div className="flex items-center justify-between">
              <div>
                <div className=" flex items-center gap-3">
                  <span className=" text-2xl  capitalize font-bold">
                    {userData?.name}{" "}
                  </span>
                  <span className="text-white rounded-[3px] capitalize text-sm border px-2 font-bold bg-gray-600">
                    ({role})
                  </span>
                </div>
                <div>
                  <p className="text-md text-xl text-gray-500 border rounded bg-gray-100 px-3 text-start mt-2">
                   Email :  {userData?.email}
                  </p>
                  <p className="text-md text-xl text-gray-500 border rounded bg-gray-100 px-3 text-start mt-2">
                   Phone : {userData?.mobilenumber}
                  </p>
                </div>
              </div>
            </div>
            <div className="   mt-[60px] rounded-b-md     bg-white">
              <div className="mx-auto  ">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSection("about")}
                    className={`flex items-center  font-bold text-lg  border-b-2 ${
                      section === "about"
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    About
                  </button>
                  <button
                    onClick={() => setSection("setting")}
                    className={`flex items-center font-bold text-lg  border-b-2 ${
                      section === "setting"
                        ? "border-blue-500 text-blue-500"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[2px]">

        </div>
        {section === "about" && (


          <div className="py-[32px] rounded-md shadow-lg lg:p-4 p-0  bg-white">
            <div className="flex flex-col lg:p-6 p-2 space-y-1">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                About
              </h3>
              <p className="text-sm text-muted-foreground">
                View and manage your profile information, including contact
                details, role, and other personal information
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 lg:p-6 p-2">
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Name"
                />
              </div>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Designation
                </label>
                <input
                  type="text"
                  
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Designation"
                />
              </div>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <input
                  disabled
                  type="text"
                  value={role}
                  // onChange={(e) => setMobilenumber(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Mobile Number"
                />
              </div>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Department
                </label>
                <input
                  type="text"
                  disabled
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Department"
                />
              </div>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Email"
                />
              </div>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={mobilenumber}
                  onChange={(e) => setMobilenumber(e.target.value)}
                  className="w-full mb-2 px-3 py-2 border rounded"
                  placeholder="Mobile Number"
                />
              </div>
            </div>
            <div className="px-6 flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-700 text-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 "
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {section === "setting" && (
          <div className="py-[32px] rounded-md shadow-lg lg:p-4 p-2  bg-white">
            <div className="flex flex-col lg:p-6 p-2 space-y-1">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">
                Change Password 
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your current password and the new password you would like
                to change to
              </p>
            </div>
            <div className="lg:p-6 p-2 space-y-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                  htmlFor="password"
                >
                  Current Password <span className="text-red-600 ">*</span>
                </label>
                <input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="password"
                  required
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                  htmlFor="new-password"
                >
                  New Password <span className="text-red-600 ">*</span>
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="new-password"
                  required
                  type="password"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                  htmlFor="confirm-password"
                >
                  Confirm New Password <span className="text-red-600 ">*</span>
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="confirm-password"
                  required
                  type="password"
                />
              </div>
              <div className="flex justify-end">  

              <button
                onClick={handleChangePassword}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-700 text-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 "
                >
                Change Password
              </button>
                </div>
            </div>
          </div>
        )}

      </div>
      </div>
    </>
  );
}

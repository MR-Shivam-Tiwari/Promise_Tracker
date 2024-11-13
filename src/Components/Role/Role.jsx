import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../global/UserContext";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";

function Role() {
  const navigate = useNavigate();
  const { roleProtected } = useContext(UserContext);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [filteredroleUserData, setFilteredroleUserData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const handleClickOutside = (event) => {
    if (event.target.id === "modal-background") {
      setIsBulkModalOpen(false);
    }
  };
  const handleClickOutsidecreateuser = (event) => {
    if (event.target.id === "modal-background-user") {
      setIsModalOpen(false);
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    mobilenumber: "",
    email: "",
    password: "",
    userRole: "",
    active: true,
  });
  const [bulkData, setBulkData] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + "/api/userData"
      );
      setUserData(Array.isArray(response.data) ? response.data : []);
      setFilteredroleUserData(
        Array.isArray(response.data) ? response.data : []
      ); // Added this line to ensure filteredroleUserData is initialized
    } catch (error) {
      console.log("Error fetching User Data: ", error);
    }
  };

  const handleInactive = (user, userId) => {
    if (userId) {
      const data = { active: false };
      axios
        .put(process.env.REACT_APP_API_URL + `/api/users/${userId}/deactivate`)
        .then((res) => {
          toast.dismiss();
          toast.success(res.data.message);
          toast.success("Member Deactivated");
          fetchUserData();
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err.response.data.message);
        });
    }
  };

  const handleActive = (user, userId) => {
    if (userId) {
      const data = { active: true };
      axios
        .put(process.env.REACT_APP_API_URL + `/api/users/${userId}/activate`)
        .then((res) => {
          toast.dismiss();
          toast.success(res.data.message);
          toast.success("Member Activated");
          fetchUserData();
        })
        .catch((err) => {
          toast.dismiss();
          toast.error(err.response.data.message);
        });
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.put(
        process.env.REACT_APP_API_URL + `/api/updateUserRole/${userId}`,
        {
          userRole: newRole,
        }
      );
      setUserData(
        userData.map((user) =>
          user.userId === userId ? { ...user, userRole: newRole } : user
        )
      );
      toast.dismiss();
      toast.success("Role Changed Successfully");
      fetchUserData();
    } catch (error) {
      console.log("Error updating User Role: ", error);
    }
  };

  const callProtectedRole = () => {
    roleProtected().then((result) => {
      if (!result) {
        navigate("/home");
      }
    });
  };
  // console.log("roleProtected" , roleProtected)

  useEffect(() => {
    callProtectedRole();
    fetchUserData();
  }, []);

  const getRole = (role, active) => {
    if (!active) {
      return "INACTIVE";
    }
    switch (role) {
      case 1:
        return "DEPARTMENT_HEAD";
      case 2:
        return "PROJECT_LEAD";
      case 3:
        return "MEMBER";
      case 0:
        return "SUPER_ADMIN";
      default:
        return "Not Defined";
    }
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) {
      return text;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
  };

  const HandleSearch = (e) => {
    setSearchTerm(e.target.value);
    setFilteredroleUserData(
      userData.filter((user) => {
        const role = getRole(user.userRole, user.active).toLowerCase();
        return (
          user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          role.includes(e.target.value.toLowerCase())
        );
      })
    );
  };

  const filteredUserData = userData.filter((user) => {
    const role = getRole(user.userRole, user.active).toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.includes(searchTerm.toLowerCase())
    );
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL + "/api/registration",
        formData
      );
      toast.success(response.data.message);
      setIsModalOpen(false);
      fetchUserData();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error.response.data.message);
    }
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }

    // Read and parse the file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Map the data to match your API structure
      const formattedData = jsonData.map((user) => ({
        name: user.Name || "",
        mobilenumber: user.MobileNumber || "",
        email: user.Email || "",
        password: user.Password || "",
        userRole: user.UserRole || "",
        active: true, // Default value, you can modify as needed
      }));

      // Send the data to the backend
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/bulk-upload`,
          formattedData
        );
        toast.success(response.data.message);
        fetchUserData();
        setIsBulkModalOpen(false);
      } catch (error) {
        toast.error("Error uploading data.");
        console.error("Error uploading data:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };
  const fetchUsersByRole = async (role) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_URL + `/api/users-by-role/${role}`
      );
      setFilteredroleUserData(response.data);
    } catch (error) {
      console.error("Error fetching users by role:", error);
    }
  };
  useEffect(() => {
    if (selectedRole !== "") {
      fetchUsersByRole(selectedRole);
    }
  }, [selectedRole]);
  // Function to get user role from localStorage
  function getUserRole() {
    // Get the user data from localStorage
    const userData = localStorage.getItem("userData");

    // Check if user data exists
    if (userData) {
      // Parse the user data JSON to an object
      const user = JSON.parse(userData);

      // Return the userRole if it exists in the user data
      return user.userRole || null;
    }

    // Return null if no user data is found
    return null;
  }

  // Example usage
  const userRole = getUserRole();
  console.log("User Role:", userRole);

  const showButton = ![1, 2, 3].includes(userRole);


  return (
    <div>
      <div className=" text-black mx-auto">
        <div className=" mb-3">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
            <div className="relative ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m2-7A7 7 0 1 1 3 10a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="lg:w-[300px]  w-full p-2 ps-10  text-sm text-gray-900 h-10 border-gray-300 border-[3px]   rounded-[5px]"
                placeholder="Search By Name, Email, Role"
                onChange={HandleSearch}
              />
            </div>
            <div className="lg:flex justify-end gap-3 ">
              <div className="">
                <select
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className=" p-2 border text-white h-10 w-full lg:w-[150px] bg-[#8BC940] rounded"
                >
                  <option value="">Filter By Role</option>
                  <option value="0">Admin</option>
                  <option value="1">Department Head</option>
                  <option value="2">Project Lead</option>
                  <option value="3">Member</option>
                </select>
              </div>
              <div className="flex lg:mt-0 mt-3  gap-3">
                <button
                  className="flex items-center whitespace-nowrap lg:w-[150px] w-full justify-center px-4  h-10 py-2 font-medium text-white bg-[#8BC940] rounded hover:bg-[#A1DF60] focus:outline-none"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="">Create Member</span>
                </button>
                <button
                  className="flex items-center w-full lg:w-[150px] whitespace-nowrap justify-center h-10 px-4 py-2 font-medium text-white bg-[#8BC940] rounded hover:bg-[#A1DF60] focus:outline-none"
                  onClick={() => setIsBulkModalOpen(true)}
                >
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg overflow-auto relative border bg-white shadow-md w-full">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-300">
              <tr className="text-xs text-gray-700 uppercase">
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Actions
                </th>
                <th scope="col" className="px-4 py-3">
                  Activate/Deactivate
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredroleUserData.map((user, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {highlightText(user.name, searchTerm)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {highlightText(user.email, searchTerm)}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    <div
                      className={`inline-flex w-fit items-center whitespace-nowrap text-black border text-xs transition-colors font-bold px-3 py-1 rounded ${
                        user.userRole === 3
                          ? "bg-yellow-500"
                          : user.userRole === 0
                          ? "bg-green-400"
                          : user.userRole === 1
                          ? "bg-blue-400"
                          : "bg-gray-500 text-gray-200"
                      }`}
                      data-v0-t="badge"
                    >
                      {highlightText(
                        getRole(user.userRole, user.active),
                        searchTerm
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {user.active ? "Active" : "Inactive"}
                  </td>
                  {user.userRole !== 0 && (
                    <td className="px-4 py-3">
                      <Dropdown>
                        <MenuButton
                          className="rounded-[5px] w-[140px] bg-gray-300 text-gray-600 font-bold"
                          slotProps={{
                            root: { variant: "outlined", color: "neutral" },
                          }}
                        >
                          Change Role
                        </MenuButton>
                        <Menu>
                          <MenuItem
                            onClick={() => handleRoleChange(user.userId, 3)}
                          >
                            MEMBER
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleRoleChange(user.userId, 1)}
                          >
                            DEPARTMENT_HEAD
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleRoleChange(user.userId, 2)}
                          >
                            PROJECT_LEAD
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </td>
                  )}
                  {user.userRole !== 0 && (
                    <td className="px-4 py-3 text-gray-900">
                      {showButton && (
                        <button
                          onClick={() => {
                            user.active
                              ? handleInactive(user, user.userId)
                              : handleActive(user, user.userId);
                          }}
                          className={`rounded-[5px] ${
                            user.active
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white font-bold py-2 px-4 rounded`}
                        >
                          {user.active ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-background-user"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClickOutsidecreateuser}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Member</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name <span className="text-red-600 ">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="mobilenumber"
                >
                  Mobile Number <span className="text-red-600 ">*</span>
                </label>
                <input
                  id="mobilenumber"
                  name="mobilenumber"
                  type="text"
                  value={formData.mobilenumber}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email <span className="text-red-600 ">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password <span className="text-red-600 ">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="userRole"
                >
                  User Role <span className="text-red-600 ">*</span>
                </label>
                <select
                  id="userRole"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select Role</option>
                  {/* <option value="0">SUPER_ADMIN</option> */}
                  <option value="1">DEPARTMENT_HEAD</option>
                  <option value="2">PROJECT_LEAD</option>
                  <option value="3">MEMBER</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {isBulkModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClickOutside}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Bulk Upload Members</h2>
            <div className="py-3 mb-3 border rounded p-3 bg-gray-200">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Role;

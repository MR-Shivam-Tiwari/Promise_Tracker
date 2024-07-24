import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Role() {
    const [userData, setUserData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/userData');
            setUserData(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching User Data: ", error);
        }
    };
    const handleInactive = (user, userId) => {
        if (userId) {
            const data = { active: false }; // Define your data object
            axios.put(`http://localhost:5000/api/users/${userId}/deactivate`)
                .then((res) => {
                    toast.dismiss();
                    toast.success(res.data.message);
                    fetchUserData(); // Assuming this function fetches updated user data
                })
                .catch((err) => {
                    toast.dismiss();
                    toast.error(err.response.data.message);
                });
        }
    };
    
    const handleActive = (user, userId)=>{
        if(userId ){
            const data = {active:true}
            axios.put(`http://localhost:5000/api/users/${userId}/activate` )
            .then((res)=>{
                toast.dismiss();
                toast.success(res.data.message);
                fetchUserData();
            }).catch((err)=>{
                toast.dismiss();
                toast.error(err.response.data.message);
            })
        }
    }
    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/updateUserRole/${userId}`, {
                userRole: newRole
            });
            setUserData(userData.map(user => user.userId === userId ? { ...user, userRole: newRole } : user));
            toast.success("Role Changed Successfully")
        } catch (error) {
            console.log("Error updating User Role: ", error);
        }
    };

    useEffect(() => {
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
        const regex = new RegExp(`(${highlight})`, 'gi');
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? <span key={index} className="bg-yellow-200">{part}</span> : part
        );
    };
    const handleRoleChange = (userId, newRole) => {
        updateUserRole(userId, newRole);
    };

    const HandleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredUserData = userData.filter(user => {
        const role = getRole(user.userRole, user.active).toLowerCase();
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()) || role.includes(searchTerm.toLowerCase())
    })


    return (
        <div>
            <div className="container text-black mx-auto">
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className="text-[20px] font-bold mb-6 text-gray-900">User Roles</h1>
                    </div>
                    <div> 
                        <div className="max-w-md flex gap-3 mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="w-[260px] p-2 ps-10 text-sm text-gray-900 border border-gray-300 border-[3px]  rounded-lg" placeholder="Search By Name, Email, Role" onChange={HandleSearch} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="rounded w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserData.map((user, index) => (
                                <tr key={index} className="border-b border-gray-200 bg-white">
                                    <td className="px-4 py-3 text-gray-900">{highlightText(user.name, searchTerm)}</td>
                                    <td className="px-4 py-3 text-gray-900">{highlightText(user.email, searchTerm)}</td>
                                    <td className="px-4 py-3 text-gray-900">
                                        <div
                                            className={`inline-flex w-fit items-center whitespace-nowrap text-black border text-xs transition-colors font-bold px-3 py-1 rounded ${user.userRole === 3
                                                ? "bg-yellow-500"
                                                : user.userRole === 0
                                                    ? "bg-green-400"
                                                    : user.userRole === 1
                                                        ? "bg-blue-400"
                                                        : "bg-gray-500 text-gray-200"
                                                }`}
                                            data-v0-t="badge"
                                        >
                                            {highlightText(getRole(user.userRole, user.active), searchTerm)}
                                        </div>
                                    </td>
                                    {user.userRole !== 0 && (
                                        <td className="px-4 py-3">
                                            <Dropdown>
                                                <MenuButton
                                                    className="rounded-[5px] bg-gray-300 text-gray-600 font-bold"
                                                    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                                >
                                                    Change Role
                                                </MenuButton>
                                                <Menu>
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 3)}>MEMBER</MenuItem>
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 1)}>DEPARTMENT_HEAD</MenuItem>
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 2)}>PROJECT_LEAD</MenuItem>
                                                    {
                                                        user?.active?<MenuItem onClick={() => handleInactive(user, user.userId)}>INACTIVE</MenuItem>
                                                        :
                                                        <MenuItem onClick={() => handleActive(user, user.userId)}>ACTIVE</MenuItem>
                                                    }
                                                </Menu>
                                            </Dropdown>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Role;

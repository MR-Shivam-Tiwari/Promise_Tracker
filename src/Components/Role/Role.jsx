import { Dropdown, Menu, MenuButton, MenuItem } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function Role() {
    const [userData, setUserData] = useState([]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://ptb.insideoutprojects.in/api/userData');
            setUserData(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching User Data: ", error);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await axios.put(`https://ptb.insideoutprojects.in/api/updateUserRole/${userId}`, {
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

    const getRole = (role) => {
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

    const handleRoleChange = (userId, newRole) => {
        updateUserRole(userId, newRole);
    };

    return (
        <div>
            <div className="container text-black mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">User Roles</h1>
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
                            {userData.map((user, index) => (
                                <tr key={index} className="border-b border-gray-200 bg-white">
                                    <td className="px-4 py-3 text-gray-900">{user.name}</td>
                                    <td className="px-4 py-3 text-gray-900">{user.email}</td>
                                    <td className="px-4 py-3 text-gray-900">
                                        <div
                                            className={`inline-flex w-fit items-center whitespace-nowrap text-black border text-xs  transition-colors  font-bold px-3 py-1 rounded ${user.userRole === 3
                                                ? "bg-yellow-500"
                                                : user.userRole === 0
                                                    ? "bg-green-400"
                                                    : user.userRole === 1
                                                        ? "bg-blue-400"
                                                        : "bg-gray-500"
                                                }`}
                                            data-v0-t="badge"
                                        >
                                            {getRole(user.userRole)}
                                        </div>
                                    </td>

                                    {!user.userRole == 0 &&
                                        <td className="px-4 py-3">
                                            <Dropdown>
                                                <MenuButton
                                                    className="rounded-[5px] bg-gray-300 text-gray-600 font-bold"
                                                    slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                                                >
                                                    Change Role
                                                </MenuButton>

                                                <Menu>
                                                    {/* <MenuItem onClick={() => handleRoleChange(user.userId, 0)}>SUPER_ADMIN</MenuItem> */}
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 3)}>MEMBER</MenuItem>
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 1)}>DEPARTMENT_HEAD</MenuItem>
                                                    <MenuItem onClick={() => handleRoleChange(user.userId, 2)}>PROJECT_LEAD</MenuItem>
                                                </Menu>
                                            </Dropdown>
                                        </td>
                                    }

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

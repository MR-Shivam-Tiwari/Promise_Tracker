import { Autocomplete, Button } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function CreateGroups() {
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        groupName: '',
        deptHead: [],
        projectLead: [],
        members: [],
        profilePic: null
    });

    const handleChange = (e, value, fieldName) => {
        let selectedUsers = [];

        if (fieldName === 'deptHead') {
            selectedUsers = value.map((name) => {
                return departmentHeads.find((head) => head.name === name);
            });
        } else if (fieldName === 'projectLead') {
            selectedUsers = value.map((name) => {
                return selectProjectLead.find((lead) => lead.name === name);
            });
        } else if (fieldName === 'members') {
            selectedUsers = value.map((name) => {
                return selectmembers.find((member) => member.name === name);
            });
        }

        console.log(`Selected users for ${fieldName}:`, selectedUsers);
        setFormData({ ...formData, [fieldName]: selectedUsers });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setFormData({ ...formData, profilePic: reader.result });
        };
        reader.onerror = (error) => {
            console.error('Error reading the file:', error);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting form data:", formData);

        try {
            const response = await axios.post(process.env.REACT_APP_API_URL+"/api/tgroups", formData);
            console.log("Response data:", response.data);
            resetForm();
            toast.dismiss()

            toast.success("Group created successfully!");
            setInterval(() => {
                window.location.reload();
            }, 2000)
        } catch (error) {
            console.error("Error creating group:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error("Error: " + error.response.data.error);
            } else {
                toast.error("Failed to create group. Please try again later.");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            groupName: '',
            deptHead: [],
            projectLead: [],
            members: [],
            profilePic: null
        });
    };

    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_API_URL+"/api/userData");
                setUserNamesEmail(response.data);
                const filteredDepartmentHeads = response.data.filter(
                    (user) => user.userRole === 1
                );
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectlead = response.data.filter(
                    (user) => user.userRole === 2
                );
                setProjectLead(filteredProjectlead);
                const filtermember = response.data.filter(
                    (user) => user.userRole === 3
                );
                setMembers(filtermember);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Internal Server Error");
                setLoading(false);
            }
        }; 

        fetchRegisteredNames();
    }, []);

    console.log("userDa", userNamesEmail);

    return (
        <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 " htmlFor="profile-pic">
                        Profile Pic
                    </label>
                    <input
                        id="profile-pic"
                        className="block w-full rounded-lg border p-2.5 text-gray-900 bg-white"
                        type="file"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <label htmlFor="group-name" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Group Name
                    </label>
                    <input
                        id="group-name"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 "
                        placeholder="Enter group name"
                        required
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="department-head" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Department Head
                    </label>
                    <Autocomplete
                        id="department-head"
                        className="mb-3"
                        options={departmentHeads.map((head) => head.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'deptHead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />
                </div>
                <div>
                    <label htmlFor="project-lead" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Project Lead
                    </label>
                    <Autocomplete
                        id="project-lead"
                        className="mb-3"
                        options={selectProjectLead.map((lead) => lead.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'projectLead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />
                </div>
                <div>
                    <label htmlFor="members" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Members
                    </label>
                    <Autocomplete
                        placeholder="Search Members"
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                        options={selectmembers.map((member) => member.name)}
                        onChange={(e, value) => handleChange(e, value, 'members')}
                        multiple
                    />
                </div>
                <div className='flex justify-end'>
                    <Button type='submit'>
                        Create Group
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateGroups;

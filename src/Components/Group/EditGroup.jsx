import { Autocomplete, Button } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function EditGroup({ Editid, dpthead, prjtlead }) {
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

        // Log form data to ensure it's correctly structured
        console.log("Form Data: ", JSON.stringify(formData, null, 2));

        try {
            const response = await axios.put(`http://localhost:5000/api/group/${Editid}`, formData);
            console.log("Response data:", response.data);
            toast.success("Successfully updated Group");
            setInterval(() => {
                window.location.reload();
            }, 2000)
        } catch (error) {
            console.error('Error updating group:', error);
            toast.error('Error updating group:', error.message);
        }
    };



    useEffect(() => {
        console.log("Editid:", Editid);

        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/userData");
                setUserNamesEmail(response.data);
                const filteredDepartmentHeads = response.data.filter(
                    (user) => user.userRole === 1
                );
                setDepartmentHeads(filteredDepartmentHeads);
                const filteredProjectLead = response.data.filter(
                    (user) => user.userRole === 2
                );
                setProjectLead(filteredProjectLead);
                const filteredMembers = response.data.filter(
                    (user) => user.userRole === 3
                );
                setMembers(filteredMembers);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Internal Server Error");
                setLoading(false);
            }
        };

        const fetchGroupData = async () => {
            try {
                console.log("Fetching group data...");
                const response = await axios.get(`http://localhost:5000/api/groups/${Editid}`);
                const groupData = response.data;
                console.log("Group data:", groupData);

                setFormData({
                    groupName: groupData.groupName || '',
                    deptHead: groupData.deptHead || [],
                    projectLead: groupData.projectLead || [],
                    members: groupData.members || [],
                    profilePic: groupData.profilePic || null
                });
            } catch (error) {
                console.error("Error fetching group data:", error);
                setError("Internal Server Error");
            }
        };

        fetchRegisteredNames();

        if (Editid) {
            fetchGroupData();
        }
    }, [Editid]);

    return (
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Update Group</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="mb-2 block text-sm font-medium" htmlFor="profile-pic">
                        Profile Pic
                    </label>
                    <input
                        id="profile-pic"
                        className="block w-full rounded-lg border p-2.5 text-gray-900 bg-white"
                        type="file"
                        onChange={handleImageChange}
                    />
                    {formData?.profilePic && <img src={formData?.profilePic} alt="Profile" className="mt-2 w-20 h-20 rounded-full" />}
                </div>
                <div>
                    <label htmlFor="group-name" className="mb-2 block text-sm font-medium">
                        Group Name
                    </label>
                    <input
                        id="group-name"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900"
                        placeholder="Enter group name"
                        required
                        type="text"
                        name="groupName"
                        value={formData?.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                </div>
                {
                    dpthead && (


                        <div>
                            <label htmlFor="department-head" className="mb-2 block text-sm font-medium">
                                Department Head
                            </label>
                            {departmentHeads && departmentHeads.length > 0 && (
                                <Autocomplete
                                    id="department-head"
                                    className="mb-3"
                                    options={departmentHeads.filter(lead => lead && lead.name).map(lead => lead.name)}
                                    multiple
                                    getOptionLabel={(option) => option}
                                    onChange={(e, value) => handleChange(e, value, 'deptHead')}
                                    value={formData?.deptHead?.map((head) => head?.name)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props} key={option} className='px-2' style={{ fontWeight: selected ? 700 : 400 }}>
                                            {option}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <input
                                            {...params}
                                            className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm"
                                        />
                                    )}
                                />
                            )}

                        </div>
                    )
                }
                {prjtlead && (


                    <div>
                        <label htmlFor="project-lead" className="mb-2 block text-sm font-medium">
                            Project Lead
                        </label>
                        {selectProjectLead && selectProjectLead.length > 0 && (
                            <Autocomplete
                                id="project-lead"
                                className="mb-3"
                                options={selectProjectLead.filter(lead => lead && lead.name).map(lead => lead.name)}
                                multiple
                                onChange={(e, value) => handleChange(e, value, 'projectLead')}
                                value={formData?.projectLead?.map((lead) => lead?.name)}
                                getOptionLabel={(option) => option} // Use option itself as label
                                renderOption={(props, option, { selected }) => (
                                    <li {...props} key={option} className='px-2' style={{ fontWeight: selected ? 700 : 400 }}>
                                        {option}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <input
                                        {...params}
                                        className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm"
                                    />
                                )}
                            />
                        )}

                    </div>
                )}
                <div>
                    <label htmlFor="members" className="mb-2 block text-sm font-medium">
                        Members
                    </label>
                    {selectmembers && selectmembers.length > 0 && (
                        <Autocomplete
                            placeholder="Search Members"
                            className=''
                            renderInput={(params) => (
                                <input
                                    {...params}
                                    className="flex w-full items-center justify-between rounded-md border border-input m-1 px-3 py-2 text-sm"
                                />
                            )}
                            options={selectmembers.map((lead) => lead?.name)}
                            onChange={(e, value) => handleChange(e, value, 'members')}
                            value={formData?.members?.map((member) => member?.name)}
                            multiple
                            renderOption={(props, option, { selected }) => (
                                <li {...props} key={option} className='px-2' style={{ fontWeight: selected ? 700 : 400 }}>
                                    {option}
                                </li>
                            )}
                        />

                    )}
                </div>
                <div className='flex justify-end'>
                    <Button type='submit'>
                        Update Group
                    </Button>
                </div>
                <div></div>
            </form>
        </div>
    );
}

export default EditGroup;

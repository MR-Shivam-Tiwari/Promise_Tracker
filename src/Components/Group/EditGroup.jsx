import { Autocomplete, Button } from '@mui/joy'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function EditGroup({Editid}) {
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
        // Map selected user names to corresponding user objects
        const selectedUsers = value.map((name) => {
            return selectmembers.find((member) => member.name === name);
        });
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
        try {
            await axios.put(`http://localhost:5000/api/TGroup/${Editid}`, formData);
            // Optionally, you can redirect or display a success message here
            toast.success("Successfully updated Group")
            setInterval(() =>{
                window.location.reload();
            }, 2000)
        } catch (error) {
            console.error('Error updating group:', error);
            toast.error('Error updating group:', error);
            // Handle error appropriately
        }
    };
//  console.log("groupidedit", Editid)
    useEffect(() => {
        const fetchRegisteredNames = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/userData");
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
    return (
        <div>
            <h2 class="text-2xl font-bold tracking-tight ">Update Group</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div >
                    <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="profile-pic">
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
                    <label for="group-name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Group Name
                    </label>
                    <input
                        id="group-name"
                        className="block w-full rounded-lg border border-gray-300 bg-white p-1.5 text-gray-900    dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Enter group name"
                        required=""
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                </div>
                <div>
                    <label for="department-head" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
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
                    <label for="project-lead" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
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
                    <label for="members" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Members
                    </label>

                    <Autocomplete
                        placeholder="Search Members"
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                        options={selectmembers.map((lead) => lead.name)}
                        onChange={(e, value) => handleChange(e, value, 'members')}
                        multiple
                    // sx={{ width: 300 }}
                    />
                </div>

                <div className='flex justify-end' >
                    <Button
                        type='submit'
                    >
                        Create Group
                    </Button>
                </div>
                <div></div>
            </form>
        </div>
    )
}

export default EditGroup

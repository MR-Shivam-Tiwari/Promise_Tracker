import { Autocomplete, Button } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function EditGroupNew({Editid, fetchpinnedGroup, fetchGroupData, setIseditModalOpen}) {
    const [departmentHeads, setDepartmentHeads] = useState([]);
    const [selectProjectLead, setProjectLead] = useState([]);
    const [selectmembers, setMembers] = useState([]);
    const [userNamesEmail, setUserNamesEmail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allStaff, setAllStaff] = useState([]);
  const [imageLink, setImageLink] = useState("aksdjflksadjfslakfjsdalkfjsfkl");

    const [formData, setFormData] = useState({
        groupName: '',
        deptHead: [],
        projectLead: [],
        members: [],
        profilePic: null
    });

    const handleChange = (e, value, fieldName) => {
        let selectedUsers = [];

        // if (fieldName === 'deptHead') {
        //     selectedUsers = value.map((name) => {
        //         return departmentHeads.find((head) => head.name === name);
        //     });
        // } else if (fieldName === 'projectLead') {
        //     selectedUsers = value.map((name) => {
        //         return selectProjectLead.find((lead) => lead.name === name);
        //     });
        // } else if (fieldName === 'members') {
        //     selectedUsers = value.map((name) => {
        //         return selectmembers.find((member) => member.name === name);
        //     });
        // }
        selectedUsers = value.map((name) => {
           return  allStaff?.find((user) => user.name === name);
        });

        console.log(`Selected users for ${fieldName}:`, selectedUsers);
        setFormData({ ...formData, [fieldName]: selectedUsers });
    };

    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      const data = new FormData();
      data.append("image", file);
  
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-image`, data);
        const imageUrl = res.data?.result;
  
        setFormData((prevData) => ({ ...prevData, profilePic: imageUrl }));
        setImageLink(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/group/${Editid}`, formData);
        toast.dismiss();
        toast.success("Successfully updated Group");
        fetchpinnedGroup();
        fetchGroupData();
        setIseditModalOpen(false);
      } catch (error) {
        console.error("Error updating group:", error);
        toast.error("Error updating group:", error.message);
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

    const fetchRegisteredNames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/userData`);
        const users = response.data;
        setAllStaff(users);
        setDepartmentHeads(users.filter((user) => user.userRole === 1));
        setProjectLead(users.filter((user) => user.userRole === 2));
        setMembers(users.filter((user) => user.userRole === 3));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Internal Server Error");
        setLoading(false);
      }
    };
    useEffect(() => {
        

        fetchRegisteredNames();
    }, []);
    const handleClickImageInput = () => {
      document.getElementById("profile-pic").click();
    };

    useEffect(() => {
      const fetchGroupData = async () => {
        console.log('inside fetchgroupdata')
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups/${Editid}`);
          const groupData = response.data;
          setFormData({
            groupName: groupData.groupName || "",
            deptHead: groupData.deptHead || [],
            projectLead: groupData.projectLead || [],
            members: groupData.members || [],
            profilePic: groupData.profilePic || "",
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
    }, []);

    useEffect(() => {
      console.log(formData);
      console.log(imageLink);
     
    }, [formData]);

    // console.log("userDa", userNamesEmail);

    return (
        <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-center">
              <div className="relative flex shrink-0 border-2 overflow-hidden rounded-full cursor-pointer group">
                <input
                  id="profile-pic"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  onChange={handleImageChange}
                />
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic || imageLink}
                    alt="Profile"
                    className="h-[80px] w-[80px] object-cover rounded-full"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    <span onClick={handleClickImageInput} className="text-gray-500">Upload</span>
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span onClick={handleClickImageInput} className="text-white text-sm">Change</span>
                </div>
              </div>
            </div>
                <div>
                    <label htmlFor="group-name" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Group Name <span className="text-red-500 ">*</span>
                    </label>
                    <input
                        id="group-name"
                        className="block w-full lg:rounded-lg rounded-[3px] border border-gray-300 bg-white p-2.5 text-gray-900 "
                        placeholder="Enter group name"
                        required
                        type="text"
                        name="groupName"
                        value={formData?.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="department-head" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Department Head <span className="text-red-500 ">*</span>
                    </label>
                    <Autocomplete
                        id="department-head"
                        className="mb-3"
                        options={allStaff?.map((head) => head?.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'deptHead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />
                </div>
                <div>
                    <label htmlFor="project-lead" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Project Lead <span className="text-red-500 ">*</span>
                    </label> 
                    <Autocomplete
                        id="project-lead"
                        className="mb-3"
                        options={allStaff?.map((lead) => lead?.name)}
                        multiple
                        onChange={(e, value) => handleChange(e, value, 'projectLead')}
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                    />
                </div>
                <div>
                    <label htmlFor="members" className="mb-2 block text-sm font-medium text-gray-900 ">
                        Members <span className="text-red-500 ">*</span>
                    </label>
                    <Autocomplete
                        placeholder="Search Members"
                        renderInput={(params) => <input {...params} className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm" />}
                        options={allStaff?.map((member) => member?.name)}
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

export default EditGroupNew;

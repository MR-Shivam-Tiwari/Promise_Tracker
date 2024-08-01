import { Autocomplete } from "@mui/joy";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function EditGroup({ Editid,  fetchpinnedGroup, fetchGroupData , setIseditModalOpen }) {
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [selectProjectLead, setProjectLead] = useState([]);
  const [selectMembers, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allStaff, setAllStaff] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    groupName: "",
    deptHead: [],
    projectLead: [],
    members: [],
    profilePic: null,
  });

  const handleChange = (e, value, fieldName) => {
    let selectedUsers = [];

    // const selectedUsers = value.map((name) => {
    //   if (fieldName === "deptHead") {
    //     return departmentHeads.find((head) => head.name === name);
    //   } else if (fieldName === "projectLead") {
    //     return selectProjectLead.find((lead) => lead.name === name);
    //   } else if (fieldName === "members") {
    //     return selectMembers.find((member) => member.name === name);
    //   }
    //   return null;
    // });
    selectedUsers = value.map((name) => {
      return  allStaff?.find((user) => user.name === name);
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
      console.error("Error reading the file:", error);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/group/${Editid}`,
        formData
      );
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
  const fetchRegisteredNames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userData`
      );
      const users = response.data;
      setAllStaff(response.data);
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
   
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/groups/${Editid}`
        );
        const groupData = response.data;
        setFormData({
          groupName: groupData.groupName || "",
          deptHead: groupData.deptHead || [],
          projectLead: groupData.projectLead || [],
          members: groupData.members || [],
          profilePic: groupData.profilePic || null,
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
    <div className="w-[100%]  lg:w-[100vh] overflow-auto h-[80vh] ">
      {loading ? (
        <div className="flex  justify-center  ">
          <span class="loader2"></span>
        </div>
      ) : (
        <div
          className="lg:rounded-lg rounded-[3px] text-card-foreground px-1 w-full "
          data-v0-t="card"
        >
      
          <form>
            <div className="flex justify-center">
              <div className="relative flex  shrink-0 border-2 overflow-hidden rounded-full  cursor-pointer group">
                <input
                  id="profile-pic"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  onChange={handleImageChange}
                />
                {formData.profilePic ? (
                  <img
                    src={formData.profilePic}
                    alt="Profile"
                    className="h-[80px] w-[80px] object-cover rounded-full"
                  />
                ) : (
                  <span className="flex h-full w-full  items-center justify-center rounded-full bg-muted">
                    <span className="text-gray-500">Upload</span>
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">Change</span>
                </div>
              </div>
            </div>
            <div className="grid gap-1 mt-2 mb-1">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="department-head"
              >
                Group Name
              </label>
              <input
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-2xl font-semibold"
                placeholder="Enter group name"
                required
                id="group-name"
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={(e) =>
                  setFormData({ ...formData, groupName: e.target.value })
                }
              />
            </div>
            <div className="py-2 grid gap-2  mt-1">
              <div className="grid gap-2 mb-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="department-head"
                >
                  Department Head
                </label>
                <div>
                  {allStaff.length > 0 && (
                    <Autocomplete
                      id="department-head"
                      className=""
                      options={allStaff?.map((head) => head?.name) || []}
                      multiple
                      getOptionLabel={(option) => option || ""}
                      onChange={(e, value) =>
                        handleChange(e, value, "deptHead")
                      }
                      value={formData?.deptHead?.map((head) => head?.name) || []}
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          key={option}
                          className="px-2"
                          style={{ fontWeight: selected ? 700 : 400 }}
                        >
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
              </div>
              <div className="grid gap-2 mb-2">
                <label
                  htmlFor="project-lead"
                  className=" block text-sm font-medium"
                >
                  Project Lead
                </label>
                {allStaff.length > 0 && (
                  <Autocomplete
                    id="project-lead"
                    className=""
                    options={allStaff?.map((lead) => lead?.name)}

                    multiple
                    onChange={(e, value) =>
                      handleChange(e, value, "projectLead")
                    }
                    value={formData?.projectLead?.map((lead) => lead?.name)}
                    getOptionLabel={(option) => option || ""}
                    renderOption={(props, option, { selected }) => (
                      <li
                        {...props}
                        key={option}
                        className="px-2"
                        style={{ fontWeight: selected ? 700 : 400 }}
                      >
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
              <div className="grid gap-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="members"
                >
                  Members
                </label>
                {allStaff.length > 0 && (
                  <Autocomplete
                    id="members"
                    placeholder="Search Members"
                    options={allStaff.map((member) => member?.name)}
                    getOptionLabel={(option) => option || ""}

                    onChange={(e, value) => handleChange(e, value, "members") }
                    value={formData?.members?.map((member) => member?.name) || []}
                    multiple
                    renderOption={(props, option, { selected }) => (
                      <li
                        {...props}
                        key={option}
                        className="px-2"
                        style={{ fontWeight: selected ? 700 : 400 }}
                      >
                        {option}
                      </li>
                    )}
                    renderInput={(params) => (
                      <input
                        {...params}
                        className="flex w-full items-center justify-between rounded-md border border-input m-1 px-3 py-2 text-sm"
                      />
                    )}
                  />
                )}
              </div>
              <div>
                <button
                  onClick={(event) => {
                    handleSubmit(event);
                  }}
                  className="w-full lg:rounded-lg rounded-[3px] mt-3 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-700"
                >
                  Update Group
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditGroup;

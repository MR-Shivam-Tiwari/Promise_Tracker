import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CardActions from '@mui/joy/CardActions';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Avatar, Card } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';



export default function MyProfile() {
    const [userData, setUserData] = useState({});
    const [userid, setuserid] = useState("")
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const location = useLocation();
    const [profilePic, setProfilePic] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        designation: '',
        mobilenumber: '',
        profilePic: ''
    });
    // Function to handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    // Function to handle upload button click
    const handleUploadClick = () => {
        document.getElementById('image-upload').click();
    };


    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            // Fetch user data using the retrieved userId
            setuserid(userId);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://3.85.170.118:5000/api/user/${userid}`);
                const userData = response.data;
                setUserData(userData);
                setFormData({
                    name: userData.name,
                    department: userData.department,
                    designation: userData.designation,
                    mobilenumber: userData.mobilenumber,
                    profilePic: userData.profilePic,
                });

                // Convert base64 image URL to file
                const base64Image = userData.profilePic;
                const byteNumbers = atob(base64Image.split(','));
                const byteArray = [];
                for (let i = 0; i < byteNumbers.length; i++) {
                    byteArray.push(byteNumbers.charCodeAt(i));
                }
                const byteNumbersTypedArray = new Uint8Array(byteArray);
                const blob = new Blob([byteNumbersTypedArray], { type: 'image/jpeg' });
                setProfilePic(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userid) {
            fetchUserData();
        }
    }, [userid]);




    const refreshDiv = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    // Function to handle form input changes
    const handleSubmit = async () => {
        try {
            const formDataWithOtherData = {
                name: formData.name,
                department: formData.department,
                designation: formData.designation,
                mobilenumber: formData.mobilenumber,
                profilePic: formData.profilePic,
            };

            // Update text data
            const response = await axios.put(`http://3.85.170.118:5000/api/users/${userid}`, formDataWithOtherData);
            console.log('Text data updated successfully:', response.data);
            toast.success("User Details Updated");

            // Update user data state
            const updatedUserData = { ...response.data, profilePic: formData.profilePic };
            setUserData(updatedUserData);

            // Update profile picture if a new image is selected
            if (selectedImage) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const base64Image = reader.result.split(',')[1];
                    const formDataWithImage = {
                        profilePic: base64Image,
                    };

                    try {
                        // Save the image to the database
                        const imageResponse = await axios.put(`http://3.85.170.118:5000/api/users/${userid}`, formDataWithImage);
                        console.log('User image saved successfully to database:', imageResponse.data);

                        // Update user data state with the new profile picture
                        const updatedUserDataWithImage = { ...updatedUserData, profilePic: imageResponse.data.profilePic };
                        setUserData(updatedUserDataWithImage);
                        toast.success("User image updated successfully");
                    } catch (error) {
                        console.error('Error saving user image to database:', error);
                    }
                };
                reader.readAsDataURL(selectedImage);
            }

            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    console.log(userData?.profilePic, "ksjdkkj")



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        handleSubmit(); // Call handleSubmit function when component mounts
    }, []);




    const handleSaveClick = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        handleSubmit();

    };

    // Render loading spinner or placeholder text if userData is empty
    // if (!userData.userId) {
    //     return <div>Loading...</div>;
    // }
    return (
        <div key={refreshKey}>


            <Box sx={{ flex: 1, width: '100%' }}>

                <Stack
                    spacing={4}
                    sx={{
                        display: 'flex',
                        maxWidth: '800px',
                        mx: 'auto',
                        px: { xs: 2, md: 6 },
                        py: { xs: 2, md: 3 },
                    }}
                >
                    <Stack
                        spacing={4}
                        sx={{
                            display: 'flex',
                            maxWidth: '800px',
                            mx: 'auto',
                            px: { xs: 2, md: 6 },
                            py: { xs: 2, md: 3 },
                        }}
                    >
                        <div>
                            <Box sx={{ mb: 1 }}>
                                <Typography level="title-md">Personal info</Typography>

                            </Box>
                            <Divider />
                            <div className='flex items-center justify-center p-3'>

                                <Stack direction="column" spacing={1} alignItems="center">
                                    <input
                                        accept="image/*"
                                        id="image-upload"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelect}
                                    />
                                    <div >

                                        <Avatar
                                            key={refreshKey}
                                            alt="Selected Image"
                                            src={profilePic}
                                            sx={{ width: 120, height: 120 }}
                                        />
                                    </div>
                                    <IconButton
                                        aria-label="upload new picture"
                                        size="sm"
                                        component="span"
                                        variant="outlined"
                                        color="neutral"
                                        onClick={handleUploadClick}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </IconButton>
                                </Stack>
                            </div>
                            <Card>
                                <div className='lg:flex items-center justify-between'>
                                    <div>
                                        <div><p className='text-gray font-bold'>Name</p>

                                            {userData.name}</div>
                                        <div><p className='text-gray font-bold'>Department</p>  {userData?.department}</div>
                                    </div>
                                    <div>
                                        <div> <p className='text-gray font-bold'>Designation</p>  {userData?.designation}</div>
                                        <div> <p className='text-gray font-bold'>Phone number</p>  {userData?.mobilenumber}</div>
                                    </div>
                                </div>
                            </Card>
                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{ display: { md: 'flex' }, my: 1 }}
                            >
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Stack spacing={1}>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input size="sm" placeholder="Enter Your Name" name="name" value={formData.name} onChange={handleChange} />
                                        </FormControl>
                                    </Stack>
                                    <Stack>
                                        <FormControl>
                                            <FormLabel>Department</FormLabel>
                                            <Input size="sm" placeholder='Enter Your Department' name="department" value={formData.department} onChange={handleChange} />
                                        </FormControl>
                                    </Stack>
                                    <div>
                                        <FormControl sx={{ flexGrow: 1 }}>
                                            <FormLabel>Designation</FormLabel>
                                            <Input
                                                size="sm"
                                                placeholder="Enter Your Designation "
                                                name="designation"
                                                value={formData.designation}
                                                onChange={handleChange}
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl sx={{ display: { sm: 'contents' } }}>
                                            <FormLabel>Phone Number</FormLabel>
                                            <Input
                                                size="sm"
                                                placeholder="Enter Your Phone Number"
                                                name="mobilenumber"
                                                value={formData.mobilenumber}  // Bind input value to form data
                                                onChange={handleChange}       // Handle input changes
                                                sx={{ flexGrow: 1 }}
                                            />
                                        </FormControl>
                                    </div>
                                </Stack>
                            </Stack>

                            <CardActions className="flex items-center justify-end gap-4 mt-3">
                                <Button size="sm" variant="outlined" color="neutral">
                                    Cancel
                                </Button>
                                <Button size="sm" variant="solid" onClick={handleSaveClick}>
                                    Save
                                </Button>
                            </CardActions>
                        </div>

                    </Stack>
                </Stack>
            </Box>
        </div>
    );
}

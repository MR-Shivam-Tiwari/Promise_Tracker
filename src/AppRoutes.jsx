import React, { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Sidebar from './Components/Sidebar/Sidebar';
import Header from './Components/Header/Header';
import MyProfile from './Components/Profile/MyProfile';
import Approvals from './Components/Approvals/Approvals';
import Task from './Components/Task/Task';
import MainHome from './Components/Home/MainHome';
import { Avatar, Button, IconButton, Modal, ModalClose, ModalDialog } from '@mui/joy';
import Add from '@mui/icons-material/Add';
import ColorSchemeToggle from './Components/ColorToggle/ColorSchemeToggle';
import AddTask from './Components/Task/AddTask';
import axios from 'axios';
import MainTask from './Components/Task/MainTask';
function AppRoutes() {
    const [currentRouteName, setCurrentRouteName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [userid, setuserid] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const defaultAvatar = 'https://via.placeholder.com/150'; // Default avatar URL
    const [profilePic, setProfilePic] = useState(null);
    // Function to handle file selection
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    // Function to handle upload button click
    const handleUploadClick = () => {
        document.getElementById('image-upload').click();
    };
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        designation: '',
        mobilenumber: '',
        profilePic: ''
    });

    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            // Fetch user data using the retrieved userId
            fetchUserData(userId);
            console.log(userId)
            setuserid(userId)
        }
    }, []);

  

    // Function to fetch user data
    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${userid}`);
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
    useEffect(() => {
        fetchUserData(userid);
    }, [userid]);
    // Function to handle form input changes
  


    const handleRouteChange = () => {
        // Assuming your routes are in the format "/orders" or "/order-list"
        const routeName = location.pathname.split('/').pop().replace(/-/g, ' ');
        setCurrentRouteName(routeName.charAt(0).toUpperCase() + routeName.slice(1));
    };

    useEffect(() => {
        // Call handleRouteChange initially and add listener for subsequent changes
        handleRouteChange();
        return () => {
            // Clean up listener when component unmounts
        };
    }, [location.pathname]);
    const [activeComponent, setActiveComponent] = useState('');

    const handleSidebarItemClick = (componentName) => {
        setActiveComponent(componentName);
        // Do whatever you need to do when a sidebar item is clicked
        // For example, update the active component in the state
    };
    const [open, setOpen] = useState(false);
    const handleItemClick = (route) => {
        navigate(route);
    };
    return (
        <div>
            <CssVarsProvider disableTransitionOnChange>
                <CssBaseline />



                <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                    <Header />
                    <Sidebar onSidebarItemClick={handleSidebarItemClick} />
                    <Box
                        component="main"
                        className="MainContent"
                        sx={{
                            px: { xs: 1, md: 6 },
                            pt: {
                                xs: 'calc(12px + var(--Header-height))',
                                sm: 'calc(12px + var(--Header-height))',
                                md: 3,
                            },
                            pb: { xs: 2, sm: 2, md: 3 },
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0,
                            height: '100dvh',
                            gap: 1,
                        }}
                    >
                        <div className='grid col border rounded-lg p-2 gap-3'>
                            <div className="flex  lg:flex-row items-center lg:items-end  justify-between">

                                <div className="flex gap-2  items-center">
                                    <Button
                                        variant="outlined"
                                        color="neutral"
                                        className='text-xs'
                                        startDecorator={<Add />}
                                        onClick={() => setOpen(true)}
                                    >
                                        Add Task
                                    </Button>
                                    <Modal className="mt-14" open={open} onClose={() => setOpen(false)}>
                                        <ModalDialog className="bg-gray-200" maxWidth={1000} minWidth={1000} style={{ height: "800px", overflow: "auto" }} >
                                            <ModalClose />
                                            <form onSubmit={() => setOpen(false)}>
                                                <AddTask setOpen={setOpen} />
                                            </form>
                                        </ModalDialog>
                                    </Modal>
                                    <ColorSchemeToggle />
                                </div>
                                <div className="  gap-2  " style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div>

                                        <Avatar
                                            variant="outlined"
                                            size="sm"
                                            src={profilePic}
                                        />
                                    </div>
                                    <div>

                                        <Box className='' sx={{ minWidth: 0 }}>
                                            <Typography level="body-sm">Hello!</Typography>
                                            <Typography level="title-sm">{userData?.name}</Typography>

                                        </Box>
                                    </div>
                                    <div>

                                        <IconButton size="sm" variant="plain" color="neutral">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                                            </svg>
                                        </IconButton>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <Box
                            sx={{
                                display: 'flex',
                                mb: 1,
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'start', sm: 'center' },
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Breadcrumbs
                                    size="sm"
                                    aria-label="breadcrumbs"
                                    separator={<ChevronRightRoundedIcon fontSize="sm" />}
                                    sx={{ pl: 0 }}
                                >
                                    <Link
                                        underline="none"
                                        color="neutral"
                                        href="#some-link"
                                        aria-label="Home"
                                    >
                                        <HomeRoundedIcon />
                                    </Link>
                                    {/* <Link
                                        underline="hover"
                                        color="neutral"
                                        href="#some-link"
                                        fontSize={12}
                                        fontWeight={500}
                                    >
                                        Dashboard
                                    </Link> */}
                                    <Typography color="primary" fontWeight={500} fontSize={12}>
                                        {currentRouteName}
                                    </Typography>
                                </Breadcrumbs>
                            </Box>
                            <Typography level="h2" component="h1">
                                {currentRouteName}
                            </Typography>

                        </Box>

                        <div style={{ height: "1000px", overflow: "auto" }}>
                            <Routes onChange={handleRouteChange}>
                                <Route path="/profile" element={<MyProfile />} />
                                <Route path="/home" element={<MainHome />} />
                                <Route path="/approvals" element={<Approvals />} />
                                <Route path="/task" element={<Task />} />
                            </Routes>
                        </div>


                    </Box>
                </Box>
            </CssVarsProvider>
        </div >
    )
}

export default AppRoutes



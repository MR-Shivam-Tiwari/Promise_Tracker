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
import Reports from './Components/Reports/Reports';
import { toast } from 'react-toastify';
function AppRoutes() {
    const [currentRouteName, setCurrentRouteName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [opennoti, setOpennoti] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const handleClose = () => setOpennoti(false);
    const [userData, setUserData] = useState({});
    const [userid, setuserid] = useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const defaultAvatar = 'https://via.placeholder.com/150'; // Default avatar URL
    const [profilePic, setProfilePic] = useState(null);
    const [allNotifications, setAllNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/notifications`);
                const allNotifications = response.data;
                // Filter notifications based on userId
                const filteredNotifications = allNotifications.filter(notification => notification.userId === userid);
                const reversedNotifications = filteredNotifications.reverse(); // Reverse the filtered array
                setAllNotifications(reversedNotifications);

                // Count new notifications
                const newNotificationsCount = reversedNotifications.filter(notification => notification.status === 'unread').length;
                // Update state only if new count is different from the previous count
                if (newNotificationsCount !== newNotifications) {
                    setNewNotifications(newNotificationsCount);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [userid]);

    const handleOpen = () => {
        setOpennoti(true);
    };
    const markAllNotificationsAsRead = async () => {
        try {
            // Extract notification IDs from allNotifications
            const notificationIds = allNotifications.map(notification => notification._id);
            // Call the API to mark all notifications as read using the extracted IDs
            await axios.put(`http://localhost:5000/api/notifications/mark-read`, { notificationIds });
            console.log("All notifications marked as read successfully");
            // Add any additional handling as needed, such as showing a success message
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            // Add error handling, such as displaying an error message to the user
        }
    };







    console.log("notification", notifications)
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
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
                                <div className="cursor-pointer  border gap-2 px-2 rounded-lg shadow-sm bg-gray-100  " style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div onClick={() => navigate("/profile")} >

                                        <Avatar
                                            variant="outlined"
                                            size="sm"
                                            src={profilePic}
                                        />
                                    </div>
                                    <div onClick={() => navigate("/profile")}>

                                        <Box className='' sx={{ minWidth: 0, color: "" }}>
                                            <Typography className="text-gray-700" level="body-sm">Hello!</Typography>
                                            <Typography className='text-black' level="title-sm" >{userData?.name}</Typography>

                                        </Box>
                                    </div>
                                    <div>

                                        <div>
                                            <IconButton size="sm" variant="plain" color="neutral" onClick={handleOpen}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-bell-fill" viewBox="0 0 16 16">
                                                    <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                                                </svg>
                                                {newNotifications > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">{newNotifications}</span>}
                                            </IconButton>



                                            <Modal open={opennoti} onClose={handleClose}>
                                                <Box sx={{ p: 4, bgcolor: 'white', boxShadow: 24, borderRadius: 2, maxWidth: 500, margin: 'auto', marginTop: '5%' }} className=" bg-white rounded-lg h-[70%]">





                                                    <div class="rounded-lg bg-card  shadow-sm w-full max-w-md" >
                                                        <header class="mb-6 flex justify-between items-center">
                                                            <h1 class="text-2xl text-black font-bold">Notifications</h1>
                                                            <Button variant='plain' className='text-black rounded-full' onClick={() => setOpennoti(false)} ><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                                            </svg></Button>
                                                        </header>
                                                        <div className='overflow-auto' style={{ maxHeight: '480px' }}>
                                                            {allNotifications.reverse().map((notification, index) => (
                                                                <Box key={index} mb={2} className="">
                                                                    <div className="grid grid-cols-[45px_1fr_auto] text-black w-full items-center gap-4 rounded-md bg-gray-200 p-4">
                                                                        <Avatar src={notification?.owner?.profilePic} />
                                                                        <div>
                                                                            <p className="text-sm font-medium">{notification?.title}</p>
                                                                            <p className="text-sm text-gray-600 font-medium">{notification?.description}</p>
                                                                            <p className="text-sm text-gray-600 font-medium">{notification?.status}</p>
                                                                            <p className="text-sm text-gray-500">
                                                                                {notification?.created ? formatDate(notification.created) : ''}
                                                                            </p>
                                                                        </div>
                                                                        <Button component="label" onClick={() => {
                                                                            setOpennoti(false);
                                                                            navigate("/task");
                                                                        }}

                                                                            variant="outlined" color="neutral" className="inline-flex w-14 bg-gray-300  items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 ml-auto">
                                                                            View
                                                                        </Button>
                                                                    </div>
                                                                </Box>
                                                            ))}
                                                        </div>

                                                        <div className='flex justify-end  mt-3  items-end'><Button
                                                            component="label"
                                                            variant="outlined"
                                                            className='text-gray-600 bg-gray-300 hover:bg-gray-100'
                                                            color="neutral"
                                                            onClick={() => { setOpennoti(false); markAllNotificationsAsRead(); }}
                                                        >
                                                            Mark All As Read
                                                        </Button>
                                                        </div>

                                                    </div>

                                                </Box>

                                            </Modal>
                                        </div>
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
                                <Route path="/reports" element={<Reports />} />
                            </Routes>
                        </div>


                    </Box>
                </Box>
            </CssVarsProvider>
        </div >
    )
}

export default AppRoutes



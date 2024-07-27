import { Avatar, Box, Button, Skeleton } from '@mui/joy';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

function Notification({ handleClose }) {
    const [allNotifications, setAllNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [opennoti, setOpennoti] = useState(false);
    const [userid, setuserid] = useState("");
    
    const navigate = useNavigate();
    useEffect(() => {
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setuserid(userId);
        }
    }, []);
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL+`/api/notifications`);
            const allNotifications = response.data;
            const filteredNotifications = allNotifications.filter(notification => notification.userId === userid);
            const sortedNotifications = filteredNotifications.sort((a, b) => new Date(b.created) - new Date(a.created));
            setAllNotifications(sortedNotifications);
            const newNotificationsCount = sortedNotifications.filter(notification => notification.status === 'unread').length;
            if (newNotificationsCount !== newNotifications) {
                setNewNotifications(newNotificationsCount);
            }
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setLoading(false); // Set loading to false in case of error
        }
    };

    useEffect(() => {
      

        if (userid) {
            fetchNotifications();
        }
    }, [userid]);

    useEffect(()=>{
        socket.on('update_notification', (data)=>{

            console.log('alksfdjlaskjfaldskfjsdalkfjadsklfjs')
            fetchNotifications();
        })

        socket.off('update_notification');
    },[])

    const handleOpen = () => {
        setOpennoti(true);
    };

    const markAllNotificationsAsRead = async () => {
        try {
            const notificationIds = allNotifications.map(notification => notification._id);
            await axios.put(process.env.REACT_APP_API_URL+`/api/notifications/mark-read`, { notificationIds });
            // console.log("All notifications marked as read successfully");
            setInterval(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            // console.error("Error marking all notifications as read:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div>
            <Box sx={{ p: 3, bgcolor: 'white', boxShadow: 24, borderRadius: 2, maxWidth: 500, margin: 'auto', marginTop: '5%' }} className="bg-white  lg:rounded-lg rounded-[3px] h-[70%]">
                <div className="lg:rounded-lg rounded-[3px] bg-card shadow-sm w-full max-w-md">
                    <header className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl text-black font-bold">Notifications</h1>
                        <Button variant='plain' className='text-black rounded-full' onClick={handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </Button>
                    </header>
                    <div className='overflow-auto lg:rounded-lg rounded-[3px] bg-gray-100 p-2' style={{ maxHeight: '480px' }}>
                        {loading ? (
                            Array(5).fill().map((_, index) => (
                                <Box key={index} mb={2} display="flex" alignItems="center">
                                    <Skeleton variant="circular" width={45} height={45} />
                                    <Box ml={2} flexGrow={1}>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            allNotifications.map((notification, index) => (
                                <Box key={index} mb={2} className="">
                                    <div className={`flex text-black w-full items-center gap-4  rounded-md p-3 ${notification?.status === 'unread' ? 'bg-green-200' : 'bg-gray-300'}`}>
                                        <div>
                                            <div className='flex items-center gap-3 '>
                                                <p className="text-sm font-medium">{notification?.title}</p>
                                                <p className="text-sm text-black font-bold px-2 font-medium bg-yellow-400 flex items-center text-center rounded-sm ">{notification?.status}</p>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium">{notification?.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {notification?.created ? formatDate(notification.created) : ''}
                                            </p>
                                        </div>
                                        <Button
                                            component="label"
                                            onClick={() => {
                                                setOpennoti(false);
                                                navigate("/task"); handleClose();
                                            }}
                                            variant="outlined"
                                            color="neutral"
                                            className="inline-flex w-20 bg-gray-200 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-6 ml-auto"
                                        >
                                            View
                                        </Button>
                                    </div>
                                </Box>
                            ))
                        )}
                    </div>
                    <div className='flex justify-end mt-3 items-end'>
                        <Button
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
        </div>
    )
}

export default Notification;

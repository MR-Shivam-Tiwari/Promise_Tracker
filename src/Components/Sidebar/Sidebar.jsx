import React, { useEffect, useState } from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { closeSidebar } from './utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Toggler({ defaultExpanded = false, renderToggle, children }) {
    const [open, setOpen] = useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({ open, setOpen })}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateRows: open ? '1fr' : '0fr',
                    transition: '0.2s ease',
                    '& > *': {
                        overflow: 'hidden',
                    },
                }}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}

export default function Sidebar({ onSidebarItemClick }) {
    const [currentRouteName, setCurrentRouteName] = useState('');
    const location = useLocation();
    const [userData, setUserData] = useState("")
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState('home');
    useEffect(() => {
        const routeName = location.pathname.split('/').pop().replace(/-/g, ' ');
        setCurrentRouteName(routeName.charAt(0).toUpperCase() + routeName.slice(1));
    }, [location.pathname]);
    const [userid, setuserid] = useState("")
    const handleLogout = () => {
        localStorage.removeItem('userData');
        toast.error("Logout Successfully");
        navigate('/login');
        setInterval(() => {
            window.location.reload();
        }, 1000);
    };
    useEffect(() => {
        // Retrieve userData from localStorage
        const userDataString = localStorage.getItem('userData');
        if (userDataString) {
            const userDataObj = JSON.parse(userDataString);
            const userId = userDataObj.userId;
            setuserid(userId);
        }
    }, []);

    const handleItemClick = (itemName) => {
        setSelectedItem(itemName);
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get('https://ptb.insideoutprojects.in/api/userData');
            setUserData(Array.isArray(response.data) ? response.data : []);
            console.log(response.data);
        } catch (error) {
            console.log("Error fetching Group Data: ", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    // Find the current user based on the frontendUserId
    const currentUser = Array.isArray(userData) && userData.find(user => user.userId === userid);

    // Check if the current user has userRole 0, 1, or 2
    const showButton = currentUser && (currentUser.userRole === 0 || currentUser.userRole === 1);


    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: { xs: 'fixed', md: 'sticky' },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '220px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '240px',
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn)',
                    backgroundColor: 'var(--joy-palette-background-backdrop)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography style={{ fontSize: "27px", fontWeight: "bold" }}>Promise Tracker</Typography>

            </Box>
            {/* <Input size="sm" startDecorator={<SearchRoundedIcon />} placeholder="Search" /> */}
            <Box
                sx={{
                    minHeight: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        gap: 4,
                        '--List-nestedInsetStart': '30px',
                        '--ListItem-radius': (theme) => theme.vars.radius.sm,
                        marginTop: 5,
                    }}
                >






                    <ListItem nested onClick={() => { navigate('/home'); handleItemClick('home') }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'home'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-house-door-fill" viewBox="0 0 16 16">
                                        <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }} >Home</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>
                    <ListItem nested onClick={() => { navigate('/task'); handleItemClick('task') }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'task'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-calendar-date-fill" viewBox="0 0 16 16">
                                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zm5.402 9.746c.625 0 1.184-.484 1.184-1.18 0-.832-.527-1.23-1.16-1.23-.586 0-1.168.387-1.168 1.21 0 .817.543 1.2 1.144 1.2" />
                                        <path d="M16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-6.664-1.21c-1.11 0-1.656-.767-1.703-1.407h.683c.043.37.387.82 1.051.82.844 0 1.301-.848 1.305-2.164h-.027c-.153.414-.637.79-1.383.79-.852 0-1.676-.61-1.676-1.77 0-1.137.871-1.809 1.797-1.809 1.172 0 1.953.734 1.953 2.668 0 1.805-.742 2.871-2 2.871zm-2.89-5.435v5.332H5.77V8.079h-.012c-.29.156-.883.52-1.258.777V8.16a13 13 0 0 1 1.313-.805h.632z" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Task</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>
                    <ListItem nested onClick={() => { navigate('/approvals'); handleItemClick('approvals') }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'approvals'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-list-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Approvals</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>

                    <ListItem nested onClick={() => { navigate('/reports'); handleItemClick('reports') }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'reports'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-bar-graph-fill" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m.5 10v-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5m-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Reports</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>
                    <ListItem nested onClick={() => { navigate('/archive-task'); handleItemClick('archive-task') }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'archive-task'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
                                        <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Archive Tasks</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>
                    {showButton && (
                        <ListItem nested onClick={() => { navigate('/roles'); handleItemClick('roles') }}>
                            <Toggler
                                renderToggle={({ open, setOpen }) => (
                                    <ListItemButton selected={selectedItem === 'roles'} onClick={() => setOpen(!open)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" />
                                        </svg>
                                        <ListItemContent>

                                            <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Roles</Typography>
                                        </ListItemContent>


                                    </ListItemButton>
                                )}
                            >

                            </Toggler>
                        </ListItem>)}
                    <ListItem nested onClick={() => { navigate('/profile'); handleItemClick('profile'); }}>
                        <Toggler
                            renderToggle={({ open, setOpen }) => (
                                <ListItemButton selected={selectedItem === 'profile'} onClick={() => setOpen(!open)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                    </svg>
                                    <ListItemContent>

                                        <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>Profile</Typography>
                                    </ListItemContent>


                                </ListItemButton>
                            )}
                        >

                        </Toggler>
                    </ListItem>
                </List>



            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>


                <IconButton onClick={handleLogout} size="sm" className='flex px-5 gap-3 items-center ' variant="plain" color="neutral">
                    <Typography style={{ fontSize: "30px" }}>Logout</Typography>
                    <LogoutRoundedIcon style={{ fontSize: "30px" }} />
                </IconButton>
            </Box>
        </Sheet >
    );
}

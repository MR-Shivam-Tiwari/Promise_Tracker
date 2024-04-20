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
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MyProfile from './Components/Profile/MyProfile';
import Approvals from './Components/Approvals/Approvals';
import Task from './Components/Task/Task';
import MainHome from './Components/Home/MainHome';
import { Avatar, Button, DialogTitle, IconButton, Modal, ModalDialog } from '@mui/joy';
import Add from '@mui/icons-material/Add';
import ColorSchemeToggle from './Components/ColorToggle/ColorSchemeToggle';
import AddTask from './Components/Task/AddTask';
function AppRoutes() {
    const [currentRouteName, setCurrentRouteName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();


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
                            px: { xs: 2, md: 6 },
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
                        <div className='flex items-center justify-end border rounded-lg p-2 gap-3 '>
                            <Button
                                variant="outlined"
                                color="neutral"
                                startDecorator={<Add />}
                                onClick={() => setOpen(true)}
                            >
                                Add Task
                            </Button>
                            <Modal open={open} onClose={() => setOpen(false)}>
                                <ModalDialog>
                                    <DialogTitle>Create new project</DialogTitle>
                                    <form onSubmit={() => setOpen(false)}>
                                        <AddTask />

                                    </form>
                                </ModalDialog>
                            </Modal>
                            <ColorSchemeToggle />
                            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                <Avatar
                                    variant="outlined"
                                    size="lg"
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"

                                />
                                <Box className='flex gap-5' sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography level="body-sm">Hello</Typography>
                                    <Typography level="title-sm">Siriwat K.</Typography>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bell-fill" viewBox="0 0 16 16">
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901" />
                                    </svg>
                                </Box>
                                <IconButton size="sm" variant="plain" color="neutral">
                                    <LogoutRoundedIcon />
                                </IconButton>
                            </Box>

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
                                    <Link
                                        underline="hover"
                                        color="neutral"
                                        href="#some-link"
                                        fontSize={12}
                                        fontWeight={500}
                                    >
                                        Dashboard
                                    </Link>
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



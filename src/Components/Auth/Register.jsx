import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
// material-ui
import {

    Grid,

    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Box } from '@mui/joy';
import { toast } from 'react-toastify';
function Register() {
    const [loader, setLoader] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        mobilenumber: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if any field is empty
        if (Object.values(formData).some(value => value === '')) {
            toast.error("Please fill in all the fields");
            return; // Stop further execution
        }

        try {
            setLoader(true)
            const response = await axios.post(process.env.REACT_APP_API_URL+'/api/registration', formData);
            setLoader(false)
            console.log(response.data);
            toast.dismiss()
            toast.success("Registered Successfully");
            navigate('/login');
        } catch (error) {
            setLoader(false)
            toast.dismiss()
            console.error(error.response.data);
            toast.error(error.response.data.message);
        }
    };

    const theme = useTheme();
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const navigate = useNavigate();
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <div>
            <div>
                <Box sx={{ minHeight: '100vh' }}>
                    <Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}>
                        <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <path
                                d="M-516.39 358.707L-451.914 294.23L-451.846 294.163H-330.545L-378.81 342.428L-391.272 354.889L-440.697 404.314L-434.575 410.453L-157.683 687.328L125.33 404.314L75.8879 354.889L72.4068 351.391L15.1785 294.163H136.48L136.547 294.23L187.082 344.765L246.631 404.314L-157.683 808.629L-561.998 404.314L-516.39 358.707ZM-157.683 0L75.9383 233.622H-45.3627L-157.683 121.301L-270.004 233.622H-391.305L-157.683 0Z"
                                fill={theme.palette.success.light}
                                opacity="0.6"
                            />
                            <path
                                d="M-647.386 358.707L-582.91 294.23L-582.842 294.163H-461.541L-509.806 342.428L-522.268 354.889L-571.693 404.314L-565.571 410.453L-288.68 687.328L-5.66624 404.314L-55.1082 354.889L-58.5893 351.391L-115.818 294.163H5.48342L5.5507 294.23L56.0858 344.765L115.635 404.314L-288.68 808.629L-692.994 404.314L-647.386 358.707ZM-288.68 0L-55.0578 233.622H-176.359L-288.68 121.301L-401 233.622H-522.301L-288.68 0Z"
                                fill={theme.palette.error.lighter}
                                opacity="1"
                            />
                            <path
                                d="M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z"
                                fill={theme.palette.primary.light}
                            />
                        </svg>
                    </Box>
                    <Grid
                        // container
                        // direction="column"
                        // justifyContent="flex-end"
                        sx={{
                            minHeight: '100vh'
                        }}
                    >

                        <Grid >
                            <Grid
                                item
                                xs={12}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <div class="min-h-screen  flex items-center justify-center  ">
                                    <div class="bg-white w-full max-w-md lg:rounded-2xl  rounded-[3px] shadow-xl p-8">
                                        <h1 class="text-4xl font-bold text-center mb-1">Sign Up</h1>
                                        <p class="text-center text-gray-500 mb-6">Let’s Create Your Account</p>
                                        <div class="flex justify-center gap-4 mb-8">
                                            <button class="inline-flex items-center justify-center bg-gray-100 whitespace-nowrap lg:rounded-md rounded-[3px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
                                                Create New
                                            </button>
                                            <button onClick={() => navigate("/login")} class="inline-flex items-center justify-center whitespace-nowrap lg:rounded-md rounded-[3px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                                                Existing User
                                            </button>
                                        </div>
                                        <form onSubmit={handleSubmit} class="space-y-6 mb-6">
                                            <div>
                                                <input
                                                    class="flex h-10 lg:rounded-md rounded-[3px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                                                    placeholder="Name"
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 lg:rounded-md rounded-[3px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                                                    placeholder="Mobile Number"
                                                    type="text"
                                                    name="mobilenumber"
                                                    value={formData.mobilenumber}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 lg:rounded-md rounded-[3px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                                                    placeholder="Email Address"
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 lg:rounded-md rounded-[3px] border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full"
                                                    placeholder="Password"
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loader}
                                                class={`inline-flex items-center justify-center whitespace-nowrap lg:rounded-md rounded-[3px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 px-4 w-full ${loader ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#ff8c00] hover:bg-[#ff7b00]'} text-white py-3`}
                                            >
                                                SIGN UP
                                            </button>

                                        </form>

                                        
                                        <Typography align="center" variant="body2" className='mt-3' gutterBottom>
                                            Already have an account? <RouterLink className='text-blue font-bold' to="/login">Login</RouterLink>
                                        </Typography>
                                    </div>
                                </div>
                            </Grid>

                        </Grid>
                    </Grid>

                </Box>
            </div >
        </div>
    )
}

export default Register

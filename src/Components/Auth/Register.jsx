import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import {
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box } from '@mui/joy';
function Register() {
    const [checked, setChecked] = React.useState(false);
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
                        container
                        direction="column"
                        justifyContent="flex-end"
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
                                <div class="min-h-screen  flex items-center justify-center p-6">
                                    <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                                        <h1 class="text-4xl font-bold text-center mb-1">Sign Up</h1>
                                        <p class="text-center text-gray-500 mb-6">Let’s Create Your Account</p>
                                        <div class="flex justify-center gap-4 mb-8">
                                            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
                                                Create New
                                            </button>
                                            <button onClick={() => navigate("/login")} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                                                Existing User
                                            </button>
                                        </div>
                                        <form class="space-y-6 mb-6">
                                            <div>
                                                <input
                                                    class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                    placeholder="Name"
                                                    type="Name"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                    placeholder="Mobile Number"
                                                    type="Mobile Number"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                    placeholder="Email Address"
                                                    type="Email Address "
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                    placeholder="Password"
                                                    type="Password"
                                                />
                                            </div>

                                            <button onClick={()=>navigate('')} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 w-full bg-[#ff8c00] hover:bg-[#ff7b00] text-white py-3">
                                                SIGN UP
                                            </button>
                                        </form>
                                        <div class="flex items-center justify-center">
                                            <div class="flex-grow border-t border-gray-300"></div>
                                            <span class="flex-shrink mx-4 text-gray-400">Or Sign Up with</span>
                                            <div class="flex-grow border-t border-gray-300"></div>
                                        </div>
                                        <div class="flex justify-center gap-4 mt-6">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-10 w-10 rounded-full bg-white shadow-lg p-2 cursor-pointer hover:shadow-2xl"
                                            >
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <circle cx="12" cy="12" r="4"></circle>
                                                <line x1="21.17" x2="12" y1="8" y2="8"></line>
                                                <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                                                <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
                                            </svg>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                class="h-10 w-10 rounded-full bg-white shadow-lg p-2 cursor-pointer hover:shadow-2xl"
                                            >
                                                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                                                <path d="M10 2c1 .5 2 2 2 5"></path>
                                            </svg>
                                        </div>
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

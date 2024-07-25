import React, { useContext, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// material-ui
import {

    Grid,

} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/joy';
import { toast } from 'react-toastify';
import { UserContext } from '../../global/UserContext';
import { Password } from '@mui/icons-material';

function ResetPassword() {
    const navigate = useNavigate();
    const {userId} = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const theme = useTheme();



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true)

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoader(false)
            return;
        }

        axios.post(process.env.REACT_APP_API_URL+'/api/set-password', { userId, password: newPassword })
        .then((res)=>{
            toast.dismiss()
            toast.success(res.data.message);
            setLoader(false)
            navigate('/login')
        }).catch((err)=>{  
            toast.dismiss()
            toast.error(err.response.data.message);
            setLoader(false)
        })
        
    }




    return (
        <div>
            <Box sx={{ minHeight: '100vh' }}>
                {/* background here */}
                <Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0 }}>
                    <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* <path
                            d="M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z"
                            fill={theme.palette.primary.light}
                        /> */}
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
                    </svg>
                </Box>

                {/* main div here */}
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
                            <div class="min-h-screen  flex items-center justify-center p-6">
                                <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                                    <h1 class="text-4xl font-bold text-center mb-1">Reset Your Password</h1>
                                    <p class="text-center text-gray-500 mb-6">Now you can reset your password</p>

                                    <form onSubmit={handleSubmit} class="space-y-6 mb-6">
                                        <div>
                                            <input
                                                class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                placeholder="New Password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                placeholder="Confirm Password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>


                                        <button type='submit' disabled={loader} class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 w-full bg-[#ff8c00] hover:bg-[#ff7b00] text-white py-3">
                                            {loader ? 'Please wait...' : 'Submit'}
                                        </button>
                                    </form>
                                    {error && <p>{error}</p>}


                                    <div className='flex justify-between'>

                                        <button onClick={() => navigate('/login')} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Back to Login</button>
                                        <button onClick={() => navigate('/signup')} class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Create New</button>

                                    </div>
                                </div>
                            </div>
                        </Grid>

                    </Grid>
                </Grid>

            </Box>
        </div >
    )
}

export default ResetPassword

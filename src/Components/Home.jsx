import { Box } from '@mui/joy';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const theme = useTheme();
    const navigate = useNavigate();
    return (
        <div>
            <Box sx={{  }}>
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
                    </svg>
                </Box>
                <Box sx={{ position: 'absolute', filter: 'blur(18px)', zIndex: -1, bottom: 0, right: 0 }}>
                    <svg width="100%" height="calc(100vh - 175px)" viewBox="0 0 405 809" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M-358.39 358.707L-293.914 294.23L-293.846 294.163H-172.545L-220.81 342.428L-233.272 354.889L-282.697 404.314L-276.575 410.453L0.316589 687.328L283.33 404.314L233.888 354.889L230.407 351.391L173.178 294.163H294.48L294.547 294.23L345.082 344.765L404.631 404.314L0.316589 808.629L-403.998 404.314L-358.39 358.707ZM0.316589 0L233.938 233.622H112.637L0.316589 121.301L-112.004 233.622H-233.305L0.316589 0Z"
                            fill={theme.palette.primary.light}
                        />
                        <path
                            d="M-647.386 358.707L-582.91 294.23L-582.842 294.163H-461.541L-509.806 342.428L-522.268 354.889L-571.693 404.314L-565.571 410.453L-288.68 687.328L-5.66624 404.314L-55.1082 354.889L-58.5893 351.391L-115.818 294.163H5.48342L5.5507 294.23L56.0858 344.765L115.635 404.314L-288.68 808.629L-692.994 404.314L-647.386 358.707ZM-288.68 0L-55.0578 233.622H-176.359L-288.68 121.301L-401 233.622H-522.301L-288.68 0Z"
                            fill={theme.palette.error.lighter}
                            opacity="1"
                        />
                    </svg>
                </Box>


                <div className=' flex justify-center items-center' style={{ marginTop: "350px" }}>
                    <div className="flex flex-col">
                        <main className="flex-1">
                            <section className="py-12 md:py-24"> {/* Adjusted the padding */}
                                <div className="px-4 md:px-6">
                                    <div className="space-y-4 text-center">
                                        <div className="space-y-2">
                                            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                                Promise Tracker
                                            </h1>
                                            <p className="mx-auto text-gray-700  md:text-xl ">
                                                This productive tool is designed to help you better manage your tasks project-wise
                                                conveniently
                                            </p>
                                        </div>
                                        <div className="space-x-4">
                                            <a
                                                className="inline-flex h-14 w-[300px] cursor-pointer items-center justify-center rounded-md text-lg px-4 py-2 text-sm font-medium text-gray-50 shadow"
                                                style={{ background: "#EA791D" }}
                                                onClick={() => navigate('/login')}
                                            >
                                                Get Started
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </Box >
        </div >
    )
}

export default Home;

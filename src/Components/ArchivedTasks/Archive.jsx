import React from 'react'

function Archive() {
    return (
        <div>
            <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div class="bg-gray-100 bg-gray-800 rounded-lg p-6 shadow-md">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 text-gray-100">Design Wireframes</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 bg-green-800 text-green-100">
                                Completed
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500 text-gray-400 mb-2">
                            <span>End Date: 05/15/2023</span>
                            <span>Start Date: 04/01/2023</span>
                        </div>
                        <p class="text-sm text-gray-500 text-gray-400 mb-4">UI/UX Design</p>
                    </div>
                    <div class="bg-blue-100 bg-blue-800 rounded-lg p-6 shadow-md">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 text-gray-100">Develop Landing Page</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 bg-yellow-800 text-yellow-100">
                                In Progress
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500 text-gray-400 mb-2">
                            <span>End Date: 06/30/2023</span>
                            <span>Start Date: 05/01/2023</span>
                        </div>
                        <p class="text-sm text-gray-500 text-gray-400 mb-4">Web Development</p>
                    </div>
                    <div class="bg-pink-100 bg-pink-800 rounded-lg p-6 shadow-md">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 text-gray-100">Implement Analytics</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 bg-red-800 text-red-100">
                                Overdue
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500 text-gray-400 mb-2">
                            <span>End Date: 05/31/2023</span>
                            <span>Start Date: 04/15/2023</span>
                        </div>
                        <p class="text-sm text-gray-500 text-gray-400 mb-4">Data Analytics</p>
                    </div>
                    <div class="bg-green-100 bg-green-800 rounded-lg p-6 shadow-md">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-900 text-gray-100">Optimize SEO</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 bg-blue-800 text-blue-100">
                                Upcoming
                            </span>
                        </div>
                        <div class="flex items-center justify-between text-sm text-gray-500 text-gray-400 mb-2">
                            <span>End Date: 07/15/2023</span>
                            <span>Start Date: 06/01/2023</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Archive

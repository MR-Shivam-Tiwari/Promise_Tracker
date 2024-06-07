import React from 'react'

function Role() {
    return (
        <div>
            <div class="container  text-black mx-auto  ">
                <h1 class="text-2xl font-bold mb-6 text-gray-900">User Roles</h1>
                <div class="overflow-x-auto">
                    <table class=" rounded w-full table-auto">
                        <thead >
                            <tr class="bg-gray-200  ">
                                <th class="px-4 py-3 text-left font-medium text-gray-700 ">Name</th>
                                <th class="px-4 py-3 text-left font-medium text-gray-700 ">Email</th>
                                <th class="px-4 py-3 text-left font-medium text-gray-700 ">Role</th>
                                <th class="px-4 py-3 text-left font-medium text-gray-700 ">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-gray-200  bg-white ">
                                <td class="px-4 py-3 text-gray-900 ">John Doe</td>
                                <td class="px-4 py-3 text-gray-900 ">john@example.com</td>
                                <td class="px-4 py-3 text-gray-900 ">
                                    <div
                                        class="inline-flex w-fit items-center whitespace-nowrap border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white px-2 py-1 rounded-full"
                                        data-v0-t="badge"
                                    >
                                        User
                                    </div>
                                </td>
                                <td class="px-4 py-3"></td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Role

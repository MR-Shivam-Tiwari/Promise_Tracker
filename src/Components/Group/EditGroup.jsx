import React from 'react'

function EditGroup() {
    return (
        <div>
            <h2 class="text-2xl font-bold tracking-tight ">Edit Group</h2>
            <div>
                <label for="group-name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Group Name
                </label>
                <input
                    id="group-name"
                    class=" w-full rounded-lg border border-gray-300  p-2.5 text-gray-900  "
                    placeholder="Enter group name"
                    required=""
                    type="text"
                />
            </div>
            <div>
                <label for="department-head" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Department Head
                </label>
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            aria-hidden="true"
                            class="h-5 w-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                        </svg>
                    </div>
                    <select
                        id="department-head"
                        class=" w-full rounded-lg border border-gray-300  p-2.5 text-gray-900"
                    >
                        <option>Select department head</option>
                        <option value="john-doe">John Doe</option>
                        <option value="jane-smith">Jane Smith</option>
                        <option value="bob-johnson">Bob Johnson</option>
                    </select>
                </div>
            </div>
            <div>
                <label for="project-lead" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Project Lead
                </label>
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            aria-hidden="true"
                            class="h-5 w-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                        </svg>
                    </div>
                    <select
                        multiple=""
                        id="project-lead"
                        class=" w-full rounded-lg border border-gray-300  p-2.5 text-gray-900"
                    >
                        <option value="john-doe">John Doe</option>
                        <option value="jane-smith">Jane Smith</option>
                        <option value="bob-johnson">Bob Johnson</option>
                    </select>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        John Doe
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove John Doe</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Jane Smith
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove Jane Smith</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Bob Johnson
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove Bob Johnson</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <label for="members" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Members
                </label>
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            aria-hidden="true"
                            class="h-5 w-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >

                        </svg>
                    </div>
                    <select
                        multiple=""
                        id="members"
                        class=" w-full rounded-lg border border-gray-300  p-2.5 text-gray-900"
                    >
                        <option value="john-doe">John Doe</option>
                        <option value="jane-smith">Jane Smith</option>
                        <option value="bob-johnson">Bob Johnson</option>
                        <option value="alice-williams">Alice Williams</option>
                        <option value="tom-wilson">Tom Wilson</option>
                    </select>
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        John Doe
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove John Doe</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Jane Smith
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove Jane Smith</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        Bob Johnson
                        <button
                            type="button"
                            class="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-800 text-white hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:focus:ring-offset-gray-900"
                        >
                            <span class="sr-only">Remove Bob Johnson</span>
                            <svg class="h-2 w-2" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                                <path d="M1 1l6 6M7 1L1 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="ub429ftt8e">
                <label class="mb-2 block text-sm font-medium text-gray-900 dark:text-white" for="profile-pic">
                    Profile Pic
                </label>
                <input
                    class=" w-full rounded-lg border border-gray-300  p-2.5 text-gray-900"
                    id="profile-pic"
                    type="file"
                />
            </div>
            <div class="flex justify-end mt-6">
                <button
                    type="submit"
                    class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors"
                >
                    Create Group
                </button>
            </div>
        </div>
    )
}

export default EditGroup

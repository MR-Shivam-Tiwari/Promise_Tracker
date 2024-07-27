import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

function ChangePassword() {
    const userDataString = localStorage.getItem('userData');

    const [userId, setUserId] = useState(JSON.parse(userDataString)?.userId ||'');

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleChangePassword = ()=>{
        if(newPassword === confirmPassword){

            const data = {
                newPassword, oldPassword, userId
            }
            axios.post(process.env.REACT_APP_API_URL+'/api/change-password',data)
            .then((res)=>{
                toast.dismiss();
                toast.success('Password changed successfully');
                setOldPassword('')
                setNewPassword('')
                setConfirmPassword('')
            })
        }else{
            toast.dismiss();
            toast.error('New Password and Confirm Password should be same');
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
    }
    return (
        <div className="lg:rounded-lg rounded-[3px] border bg-card text-card-foreground shadow-sm w-full max-w-3xl mx-auto">
            <div className="flex flex-col p-6 space-y-1">
                <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                    Enter your current password and the new password you would like to change to
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                        htmlFor="password"
                    >
                        Current Password
                    </label>
                    <input
                        value={oldPassword}
                        onChange={(e)=>setOldPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="password"
                        required
                        type="password"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                        htmlFor="new-password"
                    >
                        New Password
                    </label>
                    <input
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="new-password"
                        required
                        type="password"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block"
                        htmlFor="confirm-password"
                    >
                        Confirm New Password
                    </label>
                    <input
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="confirm-password"
                        required
                        type="password"
                    />
                </div>
                <button onClick={handleChangePassword} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    Change Password
                </button>
            </div>
        </div>
    )
}

export default ChangePassword

import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import ChangePassword from '@/app/components/AccountSettings/changePassword';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection
import AdminNavbar from '../components/adminNavbar';

// DAL
import { getUserInfo } from '../data-access/users';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

const SettingsPage = async () => {
    try {
        const cookieStore = cookies();
        const usernameCookie = cookieStore.get('username');
        const roleCookie = cookieStore.get('role');
        
    
        if (!usernameCookie) {
          // If the username cookie doesn't exist, redirect to the home page
          redirect('/login-page');
        }
    
        // Parse the cookie if it exists
        const username = JSON.parse(JSON.stringify(usernameCookie));
        const role = JSON.parse(JSON.stringify(roleCookie));

        const userInfo = await getUserInfo(username.value);
        
        return (
            <div className="bg-neutral-900 min-h-screen flex-col items-center text-white">
                <Suspense fallback={<div>Loading...</div>}>
                    {role.value === 'User' ? <Navbar /> : <AdminNavbar />}
                </Suspense>
                <h1 className='p-7 mx-4 lg:text-3xl md:text-2xl sm:text-2xl font-mono item-center justify-center bg-neutral-800 w-[1100px] flex-1 ml-auto mr-auto'>
                    Account Information  
                </h1>
                <div className="w-full max-w-[1100px] bg-neutral-800 shadow-lg px-8 py-6 flex-1 ml-auto mr-auto">
                    {/* Username */}
                    <div className="mb-4">
                        <label
                            className="block text-white text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <p className="text-white" id="username">
                            {userInfo[0].Username}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label
                            className="block text-white text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <p className="text-white" id="email">
                            {userInfo[0].Email}
                        </p>
                    </div>

                    {/* Change password component */}
                    <ChangePassword username={userInfo[0].Username} />
                </div>
            </div>
    
        );
    
      } catch (error) {
        // Handle any errors (e.g., JSON parsing issues)
        console.error('Error reading cookie:', error);
        redirect('/login-page'); // Redirect to the home page on error
      }


};

export default SettingsPage;

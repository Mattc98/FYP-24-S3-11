import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import ChangePassword from '@/app/components/AccountSettings/changePassword';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection
import AdminNavbar from '../components/adminNavbar';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface UserAccount {
    UserID: number;
    Username: string;
    Email: string;
}

// Fetch user ID by username
const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
    const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
    return (response as UserAccount[])[0]?.UserID;
};

const fetchUserInfo = async (userId: number): Promise<UserAccount | null> => {
    const response = await calluser(`SELECT UserID, Username, Email FROM userAccount WHERE UserID = ${userId}`);
    return (response as UserAccount[])[0] || null;
};

const SettingsPage = async () => {

    try {
        const cookieStore = cookies();
        const usernameCookie = cookieStore.get('username');
        const roleCookie = cookieStore.get('role');
    
        if (!usernameCookie) {
          // If the username cookie doesn't exist, redirect to the home page
          redirect('/');
          return;
        }
    
        // Parse the cookie if it exists
        const username = JSON.parse(JSON.stringify(usernameCookie));
        const role = JSON.parse(JSON.stringify(roleCookie));
        
        if (!username?.value) {
          // If there's no valid value in the cookie, redirect to home
          redirect('/');
        }
    
        let userInfo: UserAccount | null = null;
        let error: string | null = null;
    
        if (username.value) {
            try {
                const userId = await fetchUserIdByUsername(username.value);
                if (userId) {
                    userInfo = await fetchUserInfo(userId);
                } else {
                    error = "User not found";
                }
            } catch (err) {
                console.error("Error fetching user info:", err);
                error = "An error occurred while fetching user information";
            }
        } else {
            error = "Username not provided";
        }
    
        return (
            <div className="bg-neutral-900 min-h-screen flex-col items-center">
                <Suspense fallback={<div>Loading...</div>}>
                    {role === 'Admin' ? <Navbar /> : <AdminNavbar />}
                </Suspense>
                <h1 className='p-7 mx-4 lg:text-3xl md:text-2xl sm:text-2xl font-mono item-center justify-center bg-neutral-800 w-[1100px] flex-1 ml-auto mr-auto'>
                    Account Information  
                </h1>
                    {/* Conditional rendering for error and user information */}
                {error ? (
                    <div className="text-red-500 mt-4 text-center">{error}</div>
                ) : userInfo ? (
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
                                {userInfo.Username}
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
                                {userInfo.Email}
                            </p>
                        </div>
    
                        {/* Change password component */}
                        <ChangePassword username={userInfo.Username} />
                    </div>
                ) : (
                    <div className="text-gray-300 mt-4 text-center">
                        No user information available
                    </div>
                )}
            </div>
    
        );
    
      } catch (error) {
        // Handle any errors (e.g., JSON parsing issues)
        console.error('Error reading cookie:', error);
        redirect('/'); // Redirect to the home page on error
      }


};

export default SettingsPage;

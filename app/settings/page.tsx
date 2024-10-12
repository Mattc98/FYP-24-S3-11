import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import ChangePassword from '@/app/components/AccountSettings/changePassword';

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

const SettingsPage = async ({ searchParams }: { searchParams: { username: string } }) => {
    const username = searchParams.username;
    let userInfo: UserAccount | null = null;
    let error: string | null = null;

    if (username) {
        try {
            const userId = await fetchUserIdByUsername(username);
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
        <div className="bg-neutral-900 min-h-screen flex flex-col items-center">
            <div className='bg-neutral-800'>
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
            </div>
            <h1 className='p-5 text-3xl font-mono flex item-center justify-center bg-neutral-800 w-[1100px]'>
                Account Information
            </h1>
                {/* Conditional rendering for error and user information */}
            {error ? (
                <div className="text-red-500 mt-4 text-center">{error}</div>
            ) : userInfo ? (
                <div className="w-full max-w-[1100px] bg-neutral-800 shadow-lg px-8 py-6">
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
};

export default SettingsPage;

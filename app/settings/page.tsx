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
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen p-8">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            <h1 className="text-3xl font-bold text-white mb-6">Account Information</h1>
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : userInfo ? (
                <div className="bg-gray-800 shadow-lg rounded-lg px-8 py-6 mb-4">
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <p className="text-white" id="username">{userInfo.Username}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <p className="text-white" id="email">{userInfo.Email}</p>
                    </div>
                    <ChangePassword username={userInfo.Username} />
                </div>
            ) : (
                <div className="text-gray-300">No user information available</div>
            )}
        </div>
    );
};

export default SettingsPage;

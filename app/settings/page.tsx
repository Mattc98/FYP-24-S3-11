import React, { Suspense } from 'react'
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
        <div className="container mx-auto mt-8 p-4">
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
            </div>
            <h1 className="text-2xl font-bold mb-4">Account Information</h1>
            {error ? (
                <div className="text-red-500">{error}</div>
            ) : userInfo ? (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <p className="text-gray-700" id="username">{userInfo.Username}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <p className="text-gray-700" id="email">{userInfo.Email}</p>
                    </div>
                    <ChangePassword username={userInfo.Username} />
                </div>
            ) : (
                <div>No user information available</div>
            )}
        </div>
    );
};

export default SettingsPage;
"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../adminNavbar';

const AdminHomepage = () => {
    
    const router = useRouter();


    const redirectUsers = () => {
        router.push(`/ManageUsersPage`);
    };

    const redirectRooms = () => {
        router.push(`/manageRooms`);
    };
    
    return (
        <div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <AdminNavbar />
                </Suspense>
            </div>
            <div className="min-h-screen  bg-neutral-800 text-white flex flex-col items-center justify-center space-y-8">
                <button
                    onClick={redirectUsers}
                    //disabled={!username}
                    className="bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-4 px-8 text-xl rounded-lg disabled:bg-gray-500"
                >
                    Manage Users
                </button>
                <button
                    onClick={redirectRooms}
                    //disabled={!username}
                    className="bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-4 px-8 text-xl rounded-lg disabled:bg-gray-500"
                >
                    Manage Rooms
                </button>
            </div>
        </div>
    );
};

export default AdminHomepage;
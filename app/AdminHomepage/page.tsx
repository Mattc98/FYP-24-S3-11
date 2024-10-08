"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../components/adminNavbar';

const AdminHomepage = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const usernameParam = searchParams.get('username');
            setUsername(usernameParam);
            setLoading(false);
        }
    }, []);

    const redirectUsers = () => {
        if (username) {
            router.push(`/ManageUsersPage?username=${username}`);
        }
    };

    const redirectRooms = () => {
        if (username) {
            router.push(`/manageRooms?username=${username}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <AdminNavbar />
                </Suspense>
            </div>
            <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center space-y-8">
                <button
                    onClick={redirectUsers}
                    disabled={!username}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 text-xl rounded-lg disabled:bg-gray-500"
                >
                    Manage Users
                </button>
                <button
                    onClick={redirectRooms}
                    disabled={!username}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 text-xl rounded-lg disabled:bg-gray-500"
                >
                    Manage Rooms
                </button>
            </div>
        </div>
    );
};

// Ensure to wrap the default export in a Suspense boundary
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminHomepage />
        </Suspense>
    );
}

// This ensures that the page is not pre-rendered
export const dynamic = 'force-dynamic';

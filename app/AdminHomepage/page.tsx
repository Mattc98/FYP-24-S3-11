"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

const AdminHomepage = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Ensuring this runs only on the client
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
            <Navbar />
            <div>
                <button onClick={redirectUsers} disabled={!username}>
                    Manage Users
                </button>
                <button onClick={redirectRooms} disabled={!username}>
                    Manage Rooms
                </button>
            </div>
        </div>
    );
}

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

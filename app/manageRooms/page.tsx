import React, { Suspense } from 'react';
import { calluser } from '@/aws_db/db';
import ManageRoomsPage from '../components/ManageRooms/ManageRoomsClient';
import AdminNavbar from '../components/adminNavbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
    BGP: string;
}

// Fetch all rooms
const fetchRoom = async (): Promise<Room[]> => {
    try {
        const response = await calluser("SELECT * FROM Room");
        return JSON.parse(JSON.stringify(response));
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return [];
    }
};

const ManageRooms = async () => {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    
    if (!username?.value) {
      // If there's no valid value in the cookie, redirect to home
      redirect('/');
    }

    if (!username.value) {
      return <p>No username provided.</p>;
    }
    const allRooms = await fetchRoom();

    return (
        <div className="bg-gray-100 min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
                <AdminNavbar />
            </Suspense>
            {/* Pass room data to the client component */}
            <div className="w-full mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
                <ManageRoomsPage rooms={allRooms} />
            </div>
        </div>
    );
};

export default ManageRooms;

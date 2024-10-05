import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import ManageRoomsPage from '../components/ManageRooms/ManageRoomsPage';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
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
    const allRooms = await fetchRoom();

    return (
        <div className="bg-gray-100 min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            {/* Pass room data to the client component */}
            <div className="w-full mx-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
                <ManageRoomsPage rooms={allRooms} />
            </div>
        </div>
    );
};

export default ManageRooms;

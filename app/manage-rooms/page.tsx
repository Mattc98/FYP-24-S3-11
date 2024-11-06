import React, { Suspense } from 'react';
import ManageRoomsPage from '../components/ManageRooms/ManageRoomsPage';
import AdminNavbar from '../components/adminNavbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRooms } from '../data-access/rooms';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering


const ManageRooms = async () => {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/login-page');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    
    if (!username?.value) {
      // If there's no valid value in the cookie, redirect to home
      redirect('/login-page');
    }

    if (!username.value) {
      return <p>No username provided.</p>;
    }

    const allRooms = await getRooms();

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

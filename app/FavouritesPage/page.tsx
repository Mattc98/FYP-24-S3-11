import React from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import FavouritesList from '../components/favouritesPage/FavouritesList'; // Import your client component
import { Vortex } from '../components/ui/vortex';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection


interface UserAccount {
  UserID: number;
  Username: string;
}

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  imagename: string; // Image filename or URL
}

// Fetch user ID by username
const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as UserAccount[])[0]?.UserID;
};

// Fetch rooms based on user ID
const fetchUserRooms = async (userId: number): Promise<Room[]> => {
  const response = await calluser(`
    SELECT r.RoomID, r.RoomName, r.Pax, r.imagename
    FROM Favourite f 
    JOIN Room r ON f.RoomID = r.RoomID 
    WHERE f.UserID = ${userId}
  `);
  return (response as Room[]);
};

// Main Favourites page component
const FavouritesPage = async () => { 

  try {
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
  
    const userId = await fetchUserIdByUsername(username.value);
    // Explicitly ensure userId is a number
    const parsedUserId = typeof userId === 'number' ? userId : undefined;
  
    if (parsedUserId === undefined) {
      return <p>User not found.</p>;
    }
  
    const rooms = await fetchUserRooms(parsedUserId);
  
    return (
        <div className="flex w-full h-screen overflow-hidden">
          <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="w-full max-h-screen"
        >
            <div  className="overflow-y-scroll no-scrollbar h-screen bg-neutral-800 flex-1 ml-auto mr-auto lg:w-[1100px] shadow-xl shadow-black-500/50 ">
              <Navbar />
              {rooms.length > 0 ? (
                <FavouritesList rooms={rooms} userId={parsedUserId} />
              ) : (
                <p className="text-gray-400">No rooms found for this user.</p>
              )}
            </div>
        </Vortex>
      </div>
    );

  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/'); // Redirect to the home page on erro
  }
};

export default FavouritesPage;

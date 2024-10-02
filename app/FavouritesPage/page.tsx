import React from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import FavouritesList from '../components/favouritesPage/FavouritesList'; // Import your client component

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
const FavouritesPage = async ({ searchParams }: { searchParams: { username: string } }) => {
  const { username } = searchParams;

  if (!username) {
    return <p>No username provided.</p>;
  }

  const userId = await fetchUserIdByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined;

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }

  const rooms = await fetchUserRooms(parsedUserId);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {rooms.length > 0 ? (
          <FavouritesList rooms={rooms} userId={parsedUserId} />
        ) : (
          <p className="text-gray-400">No rooms found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;

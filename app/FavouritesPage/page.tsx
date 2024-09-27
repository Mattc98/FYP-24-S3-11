import React from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';

interface UserAccount {
  UserID: number;
  Username: string;
}

interface Room {
    RoomID: number;
    RoomName: string; // Add other relevant properties
    Pax: number; // Add other relevant properties
  }

// Fetch user ID by username
const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as UserAccount[])[0]?.UserID;
};

// Fetch rooms based on user ID
const fetchUserRooms = async (userId: number): Promise<Room[]> => {
  const response = await calluser(`
    SELECT r.RoomID, r.RoomName, r.Pax
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
    if (!userId) {
      return <p>User not found.</p>;
    }
  
    const rooms = await fetchUserRooms(userId);
  
    return (
      <div>
        <div className="bg-gray-300 flex justify-center items-center py-3 space-x-8">
          <Navbar />
        </div>
        <p>{`This is ${username}'s favourite page.`}</p>
        {rooms.length > 0 ? (
          <div>
            <h2>Your Rooms:</h2>
            <ul>
              {rooms.map((room) => (
                <li key={room.RoomID}>
                  <h3>{room.RoomName}</h3>
                  <p>{room.Pax}</p>
                  
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No rooms found for this user.</p>
        )}
      </div>
    );
  };
  

export default FavouritesPage;

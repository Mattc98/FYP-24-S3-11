// app/FavouritesPage/page.tsx
import React from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import TimeSlotDropdown from './TimeSlotDropdown'; // Import your client component

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
  if (!userId) {
    return <p>User not found.</p>;
  }

  const rooms = await fetchUserRooms(userId);
  
  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  return (
    <div>
      <div className="bg-gray-300 flex justify-center items-center py-3 space-x-8">
        <Navbar />
      </div>
      <p>{`This is ${username}'s favourite page.`}</p>

      <div className="bg-gray-200 p-4 rounded-md mt-4">
        {rooms.length > 0 ? (
          <div>
            <h2>Your Rooms:</h2>
            <ul>
              {rooms.map((room) => (
                <li key={room.RoomID} className="bg-gray-500 p-4 mb-4 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold">{room.RoomName}</h3>
                  {room.imagename && (
                    <div className="w-48 h-48 mt-2 overflow-hidden rounded-md">
                      <img 
                        src={room.imagename}
                        alt={`${room.RoomName} image`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p>Pax: {room.Pax}</p>

                  {/* Render the TimeSlotDropdown for each room */}
                  <TimeSlotDropdown timeSlots={timeSlots} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No rooms found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;

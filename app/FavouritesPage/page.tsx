import React from 'react';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import TimeSlotDropdown from './TimeSlotDropdown'; // Import your client component
import DateSelector from './DateSelector'; // Import your client component

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

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  const dates = [ // Fake data for dates
    '2024-09-28',
    '2024-09-29',
    '2024-09-30',
    '2024-10-01',
    '2024-10-02',
  ];

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {rooms.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Your Favourite Rooms</h2>
            <ul className="space-y-8"> {/* Space between each room card */}
              {rooms.map((room) => (
                <li key={room.RoomID} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">{room.RoomName}</h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    {room.imagename && (
                      <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 md:mr-6">
                        <img
                          src={"/images/" + room.imagename}
                          alt={`${room.RoomName} image`}
                          className="w-full h-64 object-cover rounded-md shadow-md"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-between w-full">
                      <DateSelector dates={dates} />
                      <TimeSlotDropdown timeSlots={timeSlots} />
                      <p className="mt-4 text-gray-300">Pax: {room.Pax}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-400">No rooms found for this user.</p>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;

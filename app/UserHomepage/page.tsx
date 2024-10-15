import UserHome from "../components/Homepage/UserHomepage";
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import React, { Suspense } from 'react';
import { Vortex } from "../components/ui/vortex";
import { cookies } from 'next/headers'


interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
  imagename: string;
}
//allRooms = allRooms.filter(room => room.RoomID == unAvaBookings[0].RoomID)
interface userAccount{
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director";
}

interface userFav{
  UserID: number;
  RoomID: number;
}

interface Bookings {
  BookingID: number;
  RoomID: number;
  UserID: string;
  BookingDate: string;
  BookingTime: string;
  RoomPin: number;
  BiometricPassword: number;
}

async function fetchRoom() {
  try {
    const response = await calluser("SELECT * FROM Room");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch room data.');
  }
}

async function fetchFavs() {
  try {
    const response = await calluser("SELECT * FROM Favourite");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch room data.');
  }
}

async function fetchBookings() {
  try {
    const response = await calluser("SELECT * FROM Booking");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch room data.');
  }
}

// Fetch user ID by username
const fetchUserRoleByUsername = async (username: string): Promise<string | undefined> => {
  const response = await calluser(`SELECT Role FROM userAccount WHERE Username = '${username}'`);
  return (response as userAccount[])[0]?.Role;
};

const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as userAccount[])[0]?.UserID;
};

export default async function UserHomepage() {
  const allRooms: Room[] = await fetchRoom();
  const userFavs: userFav[] = await fetchFavs();
  const allBookings: Bookings[] = await fetchBookings();

  const cookieStore = cookies()
  const username = JSON.parse(JSON.stringify(cookieStore.get('username')));

  if (!username.value) {
    return <p>No username provided.</p>;
  }

  const UserRole = await fetchUserRoleByUsername(username.value);
  // Explicitly ensure userId is a number
  const parsedUserRole = typeof UserRole === 'string' ? UserRole : undefined; // Ensure it's a number

  if (parsedUserRole === undefined) {
    return <p>User does not have a role.</p>;
  }

  const userId = await fetchUserIdByUsername(username.value);
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }
  
  const userFavoriteRooms = userFavs
  .filter((fav) => fav.UserID == parsedUserId) // Filter based on userID
  .map((fav) => fav.RoomID); // Extract RoomID from filtered results

  
  return (

  <div className="w-[100%] h-screen overflow-hidden p-4">
    <Vortex
      backgroundColor="black"
      rangeY={800}
      particleCount={500}
      baseHue={120}
      className="flex items-center flex-col justify-center w-full h-screen"
    >
        {/* Navbar */}
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar username={username.value}/>
        </Suspense>
        {/* Main Content */}
        <UserHome allRooms={allRooms} UserRole={parsedUserRole} userID={parsedUserId} FavRooms={userFavoriteRooms} allBookings={allBookings}/>
    </Vortex>
  </div>

  );
}


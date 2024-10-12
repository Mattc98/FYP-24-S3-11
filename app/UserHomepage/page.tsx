import UserHome from "../components/Homepage/UserHomepage";
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import React, { Suspense } from 'react';

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

export default async function UserHomepage({ searchParams }: { searchParams: { username: string } }) {
  const allRooms: Room[] = await fetchRoom();
  const userFavs: userFav[] = await fetchFavs();
  const allBookings: Bookings[] = await fetchBookings();

  const { username } = searchParams;

  if (!username) {
    return <p>No username provided.</p>;
  }

  const UserRole = await fetchUserRoleByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserRole = typeof UserRole === 'string' ? UserRole : undefined; // Ensure it's a number

  if (parsedUserRole === undefined) {
    return <p>User does not have a role.</p>;
  }

  const userId = await fetchUserIdByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }
  
  const userFavoriteRooms = userFavs
  .filter((fav) => fav.UserID == parsedUserId) // Filter based on userID
  .map((fav) => fav.RoomID); // Extract RoomID from filtered results

  
  return (
    <div className="bg-neutral-900 h-max">
      {/* Navbar */}
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      {/* Main Content */}
        <UserHome allRooms={allRooms} UserRole={parsedUserRole} userID={parsedUserId} FavRooms={userFavoriteRooms} allBookings={allBookings}/>
    </div>
  );
}


import UserHome from "../components/Homepage/UserHomepage";
import { calluser } from '@/aws_db/db';
import React from 'react';
import { Vortex } from "../components/ui/vortex";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
  imagename: string;
  BGP: string;
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
  BGP: string;
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

export default async function Dashboard() {
  const allRooms: Room[] = await fetchRoom();
  const userFavs: userFav[] = await fetchFavs();
  const allBookings: Bookings[] = await fetchBookings();

  try {
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
    .filter((fav) => fav.UserID === parsedUserId) // Filter based on userID
    .map((fav) => fav.RoomID); // Extract RoomID from filtered results
    
    return (

      <div className="w-[100%] h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center w-full h-screen"
        >
          <div className="flex-1 ml-auto mr-auto min-h-screen">
              <UserHome allRooms={allRooms} UserRole={parsedUserRole} userID={parsedUserId} FavRooms={userFavoriteRooms} allBookings={allBookings}/>
          </div>
        </Vortex>
      </div>
    
      );

  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/'); // Redirect to the home page on error
  }
  
}


import UserHome from "../components/Homepage/UserHomepage";
import React from 'react';
import { Vortex } from "../components/ui/vortex";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

// DAL
import { getRooms, getFavRooms, getBookings } from '../data-access/rooms';
import { getUserInfo } from '../data-access/users';


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

export default async function Dashboard() {
  const allRooms: Room[] = await getRooms();
  const userFavs: userFav[] = await getFavRooms();
  const allBookings: Bookings[] = await getBookings();

  try {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/login-page');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    const userInfo = await getUserInfo(username.value);
 
    const userFavoriteRooms = userFavs
    .filter((fav) => fav.UserID === userInfo.UserID) // Filter based on userID
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
              <UserHome allRooms={allRooms} UserRole={userInfo.Role} userID={userInfo.UserID} FavRooms={userFavoriteRooms} allBookings={allBookings}/>
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


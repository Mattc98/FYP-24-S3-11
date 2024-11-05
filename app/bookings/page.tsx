import React from 'react'
import bookings from '../components/myBookings/myBookingsPage'
import { calluser } from '@/aws_db/db';
import { Vortex } from "../components/ui/vortex";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering


interface bookings {
    BookingID: number;
    RoomID: number;
    UserID: string;
    BookingDate: string;
    BookingTime: string;
    RoomPin: number;
    BGP: string;
}

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
    BGP: string;
}

const fetchAllBookings = async (): Promise<bookings[]> => {
      const response = await calluser("SELECT * FROM Booking");
      return JSON.parse(JSON.stringify(response));
};

const fetchRoom = async (): Promise<Room[]> => {
      const response = await calluser("SELECT * FROM Room");
      return JSON.parse(JSON.stringify(response));
};

interface userAccount{
    UserID: number;
    Username: string;
    Password: string;
    Role: "User" | "Admin" | "Director";
  }
  
// Fetch user ID by username
const fetchUserRoleByUsername = async (username: string): Promise<string | undefined> => {
    const response = await calluser(`SELECT Role FROM userAccount WHERE Username = '${username}'`);
    return (response as userAccount[])[0]?.Role;
 };

// Fetch user ID by username
const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
    const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
    return (response as userAccount[])[0]?.UserID;
};

const myBookings = async () => {

  try {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/login');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    
    if (!username?.value) {
      // If there's no valid value in the cookie, redirect to home
      redirect('/login');
    }

    // get all bookings and rooms from db
    const allBookings = await fetchAllBookings();
    const allRooms = await fetchRoom();


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
    if (!userId) {
      return <p>User not found.</p>;
    }

    return (
        <div className="flex w-full min-h-screen overflow-hidden">
          <Vortex
           backgroundColor="black"
           rangeY={800}
           particleCount={500}
           baseHue={120}
           className="w-full h-screen"
         >
            <div className='min-h-screen flex-1 ml-auto mr-auto pb-9'>
              <bookings
                  bookings={allBookings}
                  rooms={allRooms}
                  userid={JSON.stringify(userId)}
                  username={username.value}
                  userRole={parsedUserRole}
                />
            </div>
         </Vortex>
       </div>
       
    )

  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/login'); // Redirect to the home page on error
  }
}

export default myBookings

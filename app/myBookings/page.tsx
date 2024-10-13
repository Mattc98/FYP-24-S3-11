import React, { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Bookings from '../components/myBookings/myBookingsPage'
import { calluser } from '@/aws_db/db';
import { Vortex } from "../components/ui/vortex";
interface Bookings {
    BookingID: number;
    RoomID: number;
    UserID: string;
    BookingDate: string;
    BookingTime: string;
    RoomPin: number;
    BiometricPassword: number;
}

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
}

const fetchAllBookings = async (): Promise<Bookings[]> => {
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

const myBookings = async ({ searchParams }: { searchParams: { username: string } }) => {
    // get all bookings and rooms from db
    const allBookings = await fetchAllBookings();
    const allRooms = await fetchRoom();

    // get username and id
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
    if (!userId) {
      return <p>User not found.</p>;
    }

    return (
        <div className="flex w-full max-h-screen overflow-hidden">
          <Vortex
           backgroundColor="black"
           rangeY={800}
           particleCount={500}
           baseHue={120}
           className="w-full max-h-screen"
         >
            <div className='min-h-screen'>
              {/* Navbar */}
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
              </Suspense>
              <Bookings
                  bookings={allBookings}
                  rooms={allRooms}
                  userid={JSON.stringify(userId)}
                  username={username}
                  userRole={parsedUserRole}
                />
            </div>
         </Vortex>
       </div>
       
    )
}

export default myBookings

import React, { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Bookings from '../components/myBookings/myBookingsPage'
import { calluser } from '@/aws_db/db';

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

interface UserAccount {
    UserID: number;
    Username: string;
}
  
  
// Fetch user ID by username
const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
    const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
    return (response as UserAccount[])[0]?.UserID;
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
    const userId = await fetchUserIdByUsername(username);
    if (!userId) {
      return <p>User not found.</p>;
    }

    return (
        <div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
            </div>
            <div>
                <Bookings bookings={allBookings} rooms={allRooms} userid={JSON.stringify(userId)} username={username}/>
            </div>
        </div>
    )
}

export default myBookings

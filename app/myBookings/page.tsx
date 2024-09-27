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


const myBookings = async () => {
    const allBookings = await fetchAllBookings();
    const allRooms = await fetchRoom();

    return (
        <div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Navbar />
                </Suspense>
            </div>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Bookings bookings={allBookings} rooms={allRooms} />
                </Suspense>
            </div>
        </div>
    )
}

export default myBookings

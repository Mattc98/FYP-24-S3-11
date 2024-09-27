import React from 'react'
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
    try {
      const response = await calluser("SELECT * FROM Booking");
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      throw new Error('Failed to fetch bookings.');
    }
};

const fetchRoom = async (): Promise<Room[]> => {
    try {
      const response = await calluser("SELECT * FROM Room");
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch rooms.');
    }
};


const myBookings = async () => {
    const allBookings = await fetchAllBookings();
    const allRooms = await fetchRoom();

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <Bookings bookings={allBookings} rooms={allRooms} />
            </div>
        </div>
    )
}

export default myBookings

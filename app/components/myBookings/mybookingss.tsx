// 'use client'; // Remove 'use client' because this is a server-side component
import { calluser } from '@/aws_db/db';
import MyBookingsPage from './myBookingsPage'; // Import client-side component

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
      console.error(error);
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

const BookingsPage = async () => {
    const allBookings = await fetchAllBookings();
    const allRooms = await fetchRoom();

    return (
      <div>
        <MyBookingsPage bookings={allBookings} rooms={allRooms} />
      </div>
    );
};

export default BookingsPage;

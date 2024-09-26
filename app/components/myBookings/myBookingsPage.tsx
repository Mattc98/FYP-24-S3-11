'use client'; // This ensures the component is client-side
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface ClientBookingsProps {
    bookings: Bookings[]; // Accepting userAccount as a prop
    rooms: Room[]; //
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

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
}

interface MyBooking {
    RoomName: string;
    Pax: number;
    BookingDate: string;
    BookingTime: string;
    Type: string;
    imagename: string;
}

const MyBookingsPage: React.FC<ClientBookingsProps> = ({ bookings, rooms }) => {
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const userID = searchParams.get('userID');

  useEffect(() => {
    const filterUserBookings = () => {
      try {
        // Filter bookings by userID and map room details
        const userBookings = bookings
          .filter(booking => booking.UserID == userID)
          .map(booking => {
            const room = rooms.find(room => room.RoomID == booking.RoomID);
            if (room) {
              return {
                RoomName: room.RoomName,
                Pax: room.Pax,
                BookingDate: booking.BookingDate,
                BookingTime: booking.BookingTime,
                Type: room.Type,
                imagename: room.imagename,
              };
            }
            return null;
          })
          .filter(booking => booking !== null); // Remove null entries

        setMyBookings(userBookings as MyBooking[]);
      } catch (error) {
        console.error('Error filtering bookings:', error);
      }
    };

    filterUserBookings();
  }, [userID, bookings, rooms]);

  return (
    <div className="px-6 py-6">
      <h2 className="text-center text-2xl font-bold mb-6">Here are your upcoming bookings</h2>
      {/* Booking Cards */}
      <div className="space-y-6">
        {myBookings.length === 0 ? (
          <p>No bookings found for {username}.</p>
        ) : (
          myBookings.map((booking, index) => (
            <div key={index} className="bg-gray-400 p-4 rounded-lg shadow-md mb-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={booking.imagename} // Use the room image from the database
                  alt={booking.RoomName}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <h3 className="text-xl font-bold">{booking.RoomName}</h3>
                  <p>Date: {booking.BookingDate}</p>
                  <p>Time: {booking.BookingTime}</p>
                  <p>Attendees: {booking.Pax}</p>
                  <p>Type: {booking.Type}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Amend
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;

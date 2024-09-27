'use client'; // This ensures the component is client-side
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface ClientBookingsProps {
    bookings: Bookings[];
    rooms: Room[];
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
    RoomName: string;// room
    Pax: number; // room
    BookingDate: string; // booking
    BookingTime: string; // booking
    Type: string; // room (user/director)
    imagename: string; //room
}

const MyBookingsPage: React.FC<ClientBookingsProps> = ({ bookings, rooms }) => {
    const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
    const userID = searchParams.get('userID');

    useEffect(() =>{
      const getMyBookings = () => {
        const userBookings = bookings
          .filter(bookings => bookings.UserID == userID)
          .map(booking => {
            const room = rooms.find(room => room.RoomID == booking.RoomID);
            if (room){
              return {
                RoomName: room.RoomName,
                Pax: room.Pax,
                BookingDate: booking.BookingDate,
                BookingTime: booking.BookingTime,
                Type: room.Type,
                imagename: room.imagename
              }
            }
            return "Not this room";
          })
        
        setMyBookings(userBookings as MyBooking[]);
      };
      getMyBookings();
      // optional return fcn
    },[bookings, rooms, userID]) // dependency array
    
    // Formatting functions
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    };

    const formatTime = (time: string) => {
      // Assuming time is in "HH:mm:ss" format, you can extract hours and minutes
      const [hours, minutes] = time.split(':');
      const suffix = +hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (+hours % 12 || 12).toString();
      return `${formattedHours}:${minutes} ${suffix}`;
    };

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
                            width={300}
                            height={100}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className="text-xl font-bold">{booking.RoomName}</h3>
                            <p>Date: {formatDate(new Date(booking.BookingDate))}</p> {/* Format the date */}
                            <p>Time: {formatTime(booking.BookingTime)}</p> {/* Format the time */}
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

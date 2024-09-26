import React from 'react'
import Navbar from '../components/Navbar'
import Image from 'next/image'
import { calluser } from '@/aws_db/db';


async function fetchuser() {
    try {
      const response = await calluser("SELECT * FROM Booking");
      return JSON.parse(JSON.stringify(response));
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch user data.');
    }
}


interface Bookings {
    BookingID: number;
    RoomID: number;
    UserID: number;
    BookingDate: string;
    BookingTime: string;
    RoomPin: number;
    BiometricPassword: number;
    
}

const myBookings = async () => {
    const myBookings:Bookings[] = await fetchuser();

    return (
        <div>
            <div>
                <Navbar />
            </div>
            {/* Main Section */}
            <div className="px-6 py-6">
                <h2 className="text-center text-2xl font-bold mb-6">Here are your upcoming bookings</h2>

                {/* Booking Cards */}
                <div className="space-y-6">
                    {myBookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-400 p-4 rounded-lg shadow-md mb-6">
                            <div className="flex items-center space-x-4">
                                <Image
                                src={booking.image} // Dynamic image
                                alt={booking.roomName}
                                width={100}
                                height={100}
                                className="rounded-md"
                                />
                                <div>
                                    <h3 className="text-xl font-bold">{booking.roomName}</h3>
                                    <p>Date: {booking.date}</p>
                                    <p>Time: {booking.time}</p>
                                    <p>Attendees: {booking.attendees}</p>
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
                    ))}
                </div>
            </div>
        </div>
    )
}

export default myBookings

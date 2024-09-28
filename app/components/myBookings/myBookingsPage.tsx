'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ClientBookingsProps {
    bookings: Bookings[];
    rooms: Room[];
    userid: string;
    username: string;
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
    BookingID: number;  // Include BookingID to cancel the correct booking
    RoomName: string;
    Pax: number;
    BookingDate: string;
    BookingTime: string;
    Type: string;
    imagename: string;
}

// Time slots for the dropdown
const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
];

const MyBookingsPage: React.FC<ClientBookingsProps> = ({ bookings, rooms, username, userid }) => {
    const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
    const [showAmendModal, setShowAmendModal] = useState(false); // To control modal visibility
    const [selectedBooking, setSelectedBooking] = useState<MyBooking | null>(null); // The booking to amend
    const [newDate, setNewDate] = useState(''); // The new date
    const [newTime, setNewTime] = useState(''); // The new time slot

    useEffect(() => {
        const getMyBookings = () => {
            const userBookings = bookings
                .filter(booking => booking.UserID == userid)
                .map(booking => {
                    const room = rooms.find(room => room.RoomID == booking.RoomID);
                    if (room) {
                        return {
                            BookingID: booking.BookingID,  // Add BookingID here
                            RoomName: room.RoomName,
                            Pax: room.Pax,
                            BookingDate: booking.BookingDate,
                            BookingTime: booking.BookingTime,
                            Type: room.Type,
                            imagename: room.imagename
                        };
                    }
                    return "Not this room";
                });

            setMyBookings(userBookings as MyBooking[]);
        };
        getMyBookings();
    }, [bookings, rooms, userid]);

    // Function to handle booking cancellation
    const handleCancelBooking = async (bookingId: number) => {
        try {
            const response = await fetch('/api/deleteBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (data.success) {
                // Remove the canceled booking from the local state
                setMyBookings(prevBookings => prevBookings.filter(booking => booking.BookingID !== bookingId));
            } else {
                console.error('Failed to cancel booking:', data.error);
            }
        } catch (error) {
            console.error('Error canceling booking:', error);
        }
    };

     // Function to handle booking amendment
     const handleAmendBooking = (booking: MyBooking) => {
        setSelectedBooking(booking); // Set the booking to amend
        setNewDate(booking.BookingDate); // Default to current booking date
        setNewTime(booking.BookingTime); // Default to current booking time
        setShowAmendModal(true); // Show the modal
    };

    // Function to handle modal submission (updating the booking)
    const handleSubmitAmend = async () => {
      if (!selectedBooking) return;

      try {
          const response = await fetch('/api/amendBooking', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  bookingId: selectedBooking.BookingID,
                  newDate,
                  newTime,
              }),
          });

          const data = await response.json();

          if (data.success) {
              // Update the booking in the state
              setMyBookings(prevBookings =>
                  prevBookings.map(booking =>
                      booking.BookingID === selectedBooking.BookingID
                          ? { ...booking, BookingDate: newDate, BookingTime: newTime }
                          : booking
                  )
              );
              setShowAmendModal(false); // Close the modal
          } else {
              console.error('Failed to amend booking:', data.error);
          }
      } catch (error) {
          console.error('Error amending booking:', error);
      }
    };
    
    // Formatting functions
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const formatTime = (time: string) => {
      // Split the input time string (e.g., "09:00:00" or "14:00:00")
      const [hours, minutes] = time.split(':');
      const formattedHours = parseInt(hours);
  
      // Find the matching time slot based on the start time
      const formattedTime = timeSlots.find((slot) => {
          const [startTime] = slot.split(' - '); // Split into start and end time
          const [startHour] = startTime.split(':');
          const startHourFormatted = parseInt(startHour);
  
          // Compare the hours
          return startHourFormatted === (formattedHours % 12 || 12);
      });
  
      // If a matching time slot is found, return it
      if (formattedTime) {
          return formattedTime;
      }
  
      // If no matching time slot is found, return a default message
      return 'Time not available in slots';
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
                                    src={booking.imagename}
                                    alt={booking.RoomName}
                                    width={300}
                                    height={100}
                                    className="rounded-md"
                                />
                                <div>
                                    <h3 className="text-xl font-bold">{booking.RoomName}</h3>
                                    <p>Date: {formatDate(new Date(booking.BookingDate))}</p>
                                    <p>Time: {formatTime(booking.BookingTime)}</p>
                                    <p>Attendees: {booking.Pax}</p>
                                    <p>Type: {booking.Type}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded"
                                  onClick={() => handleAmendBooking(booking)}
                                >
                                    Amend
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleCancelBooking(booking.BookingID)} // Handle cancellation
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        {/* Modal for amending booking */}
        {showAmendModal && selectedBooking && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Amend Booking</h3>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Select New Date</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Select New Time Slot</label>
                            <select
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                {timeSlots.map((slot, index) => (
                                    <option key={index} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setShowAmendModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSubmitAmend}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
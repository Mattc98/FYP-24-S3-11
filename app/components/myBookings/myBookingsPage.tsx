'use client';
import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import Image from 'next/image';
import Navbar from '../Navbar';

interface ClientBookingsProps {
    bookings: Bookings[];
    rooms: Room[];
    userid: string;
    username: string;
    userRole: string;
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
    RoomID: number; // Include RoomID to cancel the correct booking
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

const MyBookingsPage: React.FC<ClientBookingsProps> = ({ bookings, rooms, username, userid, userRole }) => {
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
                            RoomID: room.RoomID,
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

        const isDuplicate = bookings.filter(
            (booking) =>
                formatDate(new Date(booking.BookingDate)) === formatDate(new Date(newDate)) &&
                formatTime(booking.BookingTime) === formatTime(newTime) && booking.RoomID === selectedBooking.RoomID
        );

        if (isDuplicate.length != 0) {
            if (userRole === 'Director') {
                const directorCode = prompt('A booking already exists at this time. Please enter the Director Code to proceed:');
                if (!directorCode) {
                    alert('Director code is invalid.');
                    return;
                }
                if (directorCode === '123') {
                    alert('Director code is valid. Room as been overrided.');
                    handleCancelBooking(isDuplicate[0].BookingID);
                    setShowAmendModal(false); // Close the modal after overriding
                    return;
                }       
                // You could add further validation for the director code here if needed
            } else {
                alert('A booking already exists at this time. Please choose a different time slot.');
                return;
            }
        }

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
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const formatTime = (time: string) => {
      const [hours] = time.split(':');
      const formattedHours = parseInt(hours);
  
      const formattedTime = timeSlots.find((slot) => {
          const [startTime] = slot.split(' - ');
          const [startHour] = startTime.split(':');
          const startHourFormatted = parseInt(startHour);
  
          return startHourFormatted === (formattedHours % 12 || 12);
      });
  
      if (formattedTime) {
          return formattedTime;
      }
  
      return 'Time not available in slots';
    };

    return (
        <div className="pb-6 overflow-hidden no-scrollbar col-span-1 overflow-y-scroll bg-neutral-800 flex-1 ml-auto mr-auto lg:w-[1100px] h-screen">
            <Navbar />

            <h2 className="text-center text-2xl font-semibold pb-6">Here are your upcoming bookings</h2>
            <div className="grid grid-cols-1 gap-6">
                {myBookings.length === 0 ? (
                    <p>No bookings found for {username}.</p>
                ) : (
                    myBookings.map((booking, index) => (
                        <div key={index} className="flex-1 ml-auto mr-auto lg:w-[65%] bg-gradient-to-r from-neutral-500 via-neutral-700 to-neutral-800 rounded-lg overflow-hidden shadow-lg">
                            <div className="flex items-center p-4">
                                <Image
                                    src={"/images/" + booking.imagename}
                                    alt={booking.RoomName}
                                    width={300}
                                    height={200}
                                    className="w-1/3 h-40 object-cover"
                                />
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold">{booking.RoomName}</h3>
                                    <p>Date: {formatDate(new Date(booking.BookingDate))}</p>
                                    <p>Time: {formatTime(booking.BookingTime)}</p>
                                    <p>Attendees: {booking.Pax}</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 flex justify-between px-4 py-2 bg-gray-600">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => handleAmendBooking(booking)}
                                >
                                    Amend
                                </button>
                                <button
                                    className="text-white px-4 py-2 rounded-md"
                                    onClick={() => handleCancelBooking(booking.BookingID)}
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
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 p-6 rounded-lg shadow-lg w-1/3">
                    <h3 className="text-xl font-semibold mb-4">Amend Booking</h3>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Select New Date</label>
                        <ReactDatePicker
                            selected={newDate ? new Date(newDate) : null}
                            onChange={(date) => setNewDate(date ? date.toISOString().split('T')[0] : '')}
                            dateFormat="yyyy-MM-dd"
                            className="border rounded-md p-2 w-full text-white bg-neutral-800"
                            placeholderText="Select a date"
                            minDate={new Date()}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Select New Time Slot</label>
                        <select
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 w-full p-2 border border-neutral-300 rounded"
                        >
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot} style={{ color: 'black' }}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-gray-400 text-white px-4 py-2 rounded-md"
                            onClick={() => setShowAmendModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
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

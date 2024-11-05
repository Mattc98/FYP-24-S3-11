'use client';
import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import Image from 'next/image';
import Navbar from '../Navbar';
import { toast, Toaster } from 'sonner';

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
    BGP: string;
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
    BGP: string;
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
    const [newDate, setNewDate] = useState<Date | null>(null);
    const [newTime, setNewTime] = useState(''); // The new time slot

    const getMyBookings = () => {
        const currentDate = new Date();

        const userBookings = bookings
            .filter(booking => booking.UserID == userid && new Date(booking.BookingDate) >= currentDate)
            .map(booking => {
                const room = rooms.find(room => room.RoomID == booking.RoomID);
                if (room) {
                    return {
                        BookingID: booking.BookingID,
                        RoomID: room.RoomID,
                        RoomName: room.RoomName,
                        Pax: room.Pax,
                        BookingDate: booking.BookingDate,
                        BookingTime: booking.BookingTime,
                        Type: room.Type,
                        imagename: room.imagename,
                        BGP: booking.BGP,
                    };
                }
                return null; // Return null instead of "Not this room"
            })
            .filter(booking => booking !== null) // Remove any null values from the array
            .sort((a, b) => new Date(a.BookingDate).getTime() - new Date(b.BookingDate).getTime()); // Sort by BookingDate

        setMyBookings(userBookings as MyBooking[]);
    };

    useEffect(() => {
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
        setNewDate(new Date(booking.BookingDate)); // Default to current booking date
        setNewTime(booking.BookingTime); // Default to current booking time
        setShowAmendModal(true); // Show the modal
    };

    const convertTo24Hour = (time: string) => {
        const [hours, minutesPart] = time.split(':');
        const minutes = minutesPart.slice(0, 2);
        const period = minutesPart.slice(3); // Extract AM or PM
        
        let hoursIn24 = parseInt(hours);
        
        if (period === 'PM' && hoursIn24 !== 12) {
            hoursIn24 += 12;
        } else if (period === 'AM' && hoursIn24 === 12) {
            hoursIn24 = 0; // Midnight case
        }
        
        const time24 = `${hoursIn24.toString().padStart(2, '0')}:${minutes}:00`;
        
        // Log the conversion process
        //console.log(`Converted ${time} to 24-hour format: ${time24}`);
        
        return time24;
    };
        
    const format24Time = (timeRange: string) => {
        //console.log(`Input time to format: ${timeRange}`);

        // Extract only the start time from the time range
        const [startTime] = timeRange.split(' - ');

        // Convert the start time to 24-hour format
        const startTime24 = convertTo24Hour(startTime);

        // Log the 24-hour formatted start time
        //console.log(`Formatted start time: ${startTime24}`);

        // Find the matching time slot by comparing just the start time
        const matchingSlot = timeSlots.some((slot) => {
            const [slotStart] = slot.split(' - ');
            const slotStart24 = convertTo24Hour(slotStart);

            console.log(`Comparing input start (${startTime24}) with slot start (${slotStart24})`);

            return slotStart24 === startTime24;
        });

        if (matchingSlot) {
            //console.log(`Matching time slot found: ${startTime24}`);
            return startTime24; // Return the original time range that matched
        }

        //console.log('Time not available in slots');
        return 'Time not available in slots'; // Return an appropriate message
    };
   
    const handleSubmitAmend = async () => {
        if (!selectedBooking) return;
        if (!newDate) return;
    
        // Extract new booking details
        const new24Time = format24Time(newTime);
        const sgNewDate = new Date(newDate).toLocaleDateString('en-CA');
    

        // Step 1: Check if there is a duplicate booking at the new date/time
        const isDuplicate = bookings.filter(
            (booking) =>
                formatDate(new Date(booking.BookingDate)) === formatDate(new Date(sgNewDate)) &&
                formatTime(booking.BookingTime) === formatTime(new24Time) &&
                booking.RoomID === selectedBooking.RoomID
        );
    
        let overrideOccurred = false;

        if (isDuplicate.length != 0) {
            // Step 2: If there is a conflict and user is a Director, override is allowed
            if (userRole === 'Director') {
                const directorCode = prompt('A booking already exists at this time. Enter the Director Code to proceed:');
                if (!directorCode || directorCode !== '123') {
                    toast.error('Invalid Director Code. Booking not overridden.');
                    return;
                }
    
                toast.success('Director code is valid. Room has been overridden.');
                overrideOccurred = true;
                
    
                // Step 3: Create a new booking with the updated information
                const overrideResponse = await fetch('/api/overrideBooking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId: isDuplicate[0].BookingID, // Use the ID of the duplicate (original) booking
                        sgNewDate,
                        new24Time,
                        newUserId: userid,
                    }),
                });
    
                const overrideData = await overrideResponse.json();
                if (!overrideData.success) {
                    alert('Failed to create new booking.');
                    return;
                }
    
                // Optional: Notify the original user about the booking override
                try {
                    const userResponse = await fetch(`/api/getEmailById?userId=${isDuplicate[0].UserID}`);
                    const userData = await userResponse.json();
                    if (userResponse.ok && userData.email) {
                        await fetch('/api/sendNotificationEmail', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: userData.email,
                                roomName: selectedBooking.RoomName,
                                bookingDate: sgNewDate,
                                bookingTime: newTime,
                                directorName: username,
                            }),
                        });
                    }
                } catch (error) {
                    console.error('Error sending notification email:', error);
                }
            } else {
                alert('A booking already exists at this time. Please choose a different time slot.');
                return;
            }
        }else{
            try {
                const response = await fetch('/api/amendBooking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId: selectedBooking.BookingID,
                        sgNewDate: sgNewDate,
                        new24Time: new24Time,
                    }),
                });
        
                if (response.ok) {
                    toast.success(`Room: ${selectedBooking.RoomName} on ${formatDate(new Date(sgNewDate))} at ${newTime} has been booked!`);
                } else {
                    alert('Failed to create booking.');
                    const errorData = await response.json();
                    console.log('Error response data:', errorData);
                }
            } catch (error) {
                console.error('Error creating booking:', error);
                alert('An error occurred. Please try again.');
            }
        }
    
        // Step 4: Delete the old booking if an override occurred
        if (overrideOccurred) {
            try {
                const deleteResponse = await fetch('/api/deleteOldBooking', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ bookingId: selectedBooking.BookingID }),
                });
    
                const deleteData = await deleteResponse.json();
    
                if (deleteData.success) {
                    setMyBookings((prevBookings) =>
                        prevBookings.filter((booking) => booking.BookingID !== selectedBooking.BookingID)
                    );
                } else {
                    console.error('Failed to delete old booking:', deleteData.error);
                }
            } catch (error) {
                console.error('Error deleting old booking:', error);
            }
        }
        
        setShowAmendModal(false); // Close the modal after completion
        window.location.href = "/myBookings";
    };
      
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-CA')
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

    const handleDateChange = (date: Date | null) => {
        if (date) {
          // Create a date string in ISO format for Singapore timezone
          const singaporeDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
          setNewDate(singaporeDate); // Store the date
        } else {
          setNewDate(null);
        }
      };

    return (
        <div className=" text-white pb-6 overflow-hidden no-scrollbar col-span-1 overflow-y-scroll bg-neutral-800 flex-1 ml-auto mr-auto lg:w-[1100px] h-screen">
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
                            onChange={handleDateChange}
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
        <Toaster richColors/>
    </div>
    );
};

export default MyBookingsPage;

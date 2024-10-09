"use client";
import React, { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


interface UserHomeProps {
    allRooms: Room[];
    UserRole: string;
    userID: number;
    FavRooms: number[];
    allBookings: Bookings[];
}

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
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

const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
];

const UserHomepage: React.FC<UserHomeProps> = ({ allRooms, UserRole, userID, FavRooms, allBookings }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // Modal control
    const [startDate, setStartDate] = useState<Date | null>(null);       // For Date Picker
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');        // Time slot selection
    const userId = userID;
    const [isFavorite, setIsFavorite] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [unAvaRooms, setUnAvaRooms] = useState<number[]>([]); // To store unavailable room IDs

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room); 
    };

    const handleDateIconClick = () => {
        setShowDatePicker(!showDatePicker); 
    };

    const closeModal = () => {
        setSelectedRoom(null);
        setStartDate(null);
        setSelectedTimeSlot('');
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
      
      const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const handleAvaBooking = () => {
        if (!startDate || !selectedTimeSlot) {
            alert("Please select a date and time.");
            return;
        }
    
        const formattedDate = formatDate(new Date(startDate));
    
        // Find the unavailable bookings (rooms that are booked)
        const unAvaBookings = allBookings.filter(
            (booking) =>
                formatDate(new Date(booking.BookingDate)) === formattedDate &&
                formatTime(booking.BookingTime) === selectedTimeSlot
        );
    
        // Store the RoomIDs of the unavailable rooms
        const unAvaRoomIDs = unAvaBookings.map((booking) => booking.RoomID);
        setUnAvaRooms(unAvaRoomIDs);
    
        // Close the date picker modal after rooms are fetched
        setShowDatePicker(false);
    };
    
    const availableRooms = allRooms.filter((room) => !unAvaRooms.includes(room.RoomID));


    const handleBooking = async () => {
        if (!selectedRoom || !startDate || !selectedTimeSlot) {
            alert("Please select a Room.");
            return;
        }

        // create Room pic
        const RoomPin = Math.floor(100 + Math.random() * 90).toString(); 

        // Format the date into YYYY-MM-DD format
        const formattedDate = startDate.toLocaleDateString('en-CA');

        console.log("formattedDate", formattedDate);
        try {
            const response = await fetch('/api/createBooking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    RoomID: selectedRoom.RoomID,
                    UserID: userId,
                    BookingDate: formattedDate,
                    BookingTime: selectedTimeSlot,
                    RoomPin: RoomPin,
                }),
            });

            if (response.ok) {
                alert(`Room: ${selectedRoom.RoomName} on ${formatDate(new Date(startDate))} at ${selectedTimeSlot} has been booked!`);
                closeModal(); // Close the modal on success
            } else {
                alert('Failed to create booking.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('An error occurred. Please try again.');
        }
    };

    // Update favorite state when selectedRoom changes
    useEffect(() => {
        if (selectedRoom) {
            setIsFavorite(FavRooms.includes(selectedRoom.RoomID)); // Check if the selected room is a favorite
        }
    }, [selectedRoom, FavRooms]);

    const handleFavorite = async (room: Room) => {
        try {
            const response = await fetch('/api/updateFavourites', {
                method: isFavorite ? 'DELETE' : 'POST', // Use DELETE to remove, POST to add
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    UserID: userId,
                    RoomID: room.RoomID,
                }),
            });

            if (response.ok) {
                setIsFavorite(!isFavorite); // Toggle favorite state
            } else {
                alert('Failed to update favorites.');
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative">
            <div className="px-8 py-6 max-w-7xl mx-auto relative z-10">
                <div className="relative">
                    <h2 className="text-3xl font-semibold mb-6 text-center">Here are the rooms available</h2>
                    
                    {/* Calendar Icon */}
                    <div className="absolute top-0 right-0">
                        <button
                            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition duration-300 z-20"
                            onClick={handleDateIconClick}
                        >
                            <FaCalendarAlt className="text-white w-6 h-6" />
                        </button>
                    </div>

                    {/* Date Picker - Shows only when icon is clicked */}
                    {showDatePicker && (
                        <div className="absolute top-12 right-0 bg-gray-800 p-4 rounded-lg shadow-lg z-50">
                            <div className='mb-2'>
                                <ReactDatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="border rounded-md p-2 w-full text-black"
                                    placeholderText="Select a date"
                                />
                            </div>
                            {/* Time Slot Dropdown */}
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Time:</label>
                                <select
                                    value={selectedTimeSlot}
                                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                    className="border rounded-md p-2 w-full text-black"
                                >
                                    <option value="">Choose a time slot</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300"
                                onClick={handleAvaBooking}
                            >
                                Get Rooms
                            </button>
                        </div>
                        
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-8 relative z-10">
                    {availableRooms.filter((room) => UserRole === "Director" || room.Type === "User")
                        .map((room) => (
                            <div key={room.RoomID} className="bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 cursor-pointer" onClick={() => handleRoomClick(room)}>
                                <Image
                                    src={"/images/" + room.imagename}
                                    alt={room.RoomName}
                                    width={300}
                                    height={200}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-bold">{room.RoomName}</h3>
                                    <div className="flex items-center mt-2 text-sm text-gray-400">
                                        <Image
                                            src="/images/people-icon.png"
                                            alt="Capacity"
                                            width={25}
                                            height={25}
                                        />
                                        <span className="ml-2">{room.Pax} People</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal for Room Booking */}
            {selectedRoom && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div 
                        className="bg-gray-800 p-6 rounded-lg shadow-lg text-white"
                        style={{ width: '350px', height: '300px' }} // Fixed width and height
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{selectedRoom.RoomName}</h2>
                            <button
                                className={`flex items-center justify-center w-8 h-8 transition duration-300 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                                onClick={() => {
                                    handleFavorite(selectedRoom); // Update favorites when clicked
                                }}
                            >
                                {isFavorite ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <Image
                            src={"/images/" + selectedRoom.imagename}
                            alt={selectedRoom.RoomName}
                            width={300}
                            height={200}
                            className="mb-4 rounded-md"
                        />

                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-300"
                                onClick={handleBooking}
                            >
                                Book Now
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserHomepage;


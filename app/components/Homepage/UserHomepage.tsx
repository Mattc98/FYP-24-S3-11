"use client";
import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 

interface UserHomeProps {
    allRooms: Room[];
    UserRole: string;
    userID: number;
}

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
}

const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
];

const UserHomepage: React.FC<UserHomeProps> = ({ allRooms, UserRole, userID }) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // Modal control
    const [startDate, setStartDate] = useState<Date | null>(null);       // For Date Picker
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');        // Time slot selection
    const userId = userID;

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room); // Show modal with room details
    };

    const closeModal = () => {
        setSelectedRoom(null);
        setStartDate(null);
        setSelectedTimeSlot('');
    };

    const handleBooking = async () => {
        if (!selectedRoom || !startDate || !selectedTimeSlot) {
            alert("Please select a date and time.");
            return;
        }

        // create Room pic
        const RoomPin = Math.floor(100 + Math.random() * 90).toString(); 
        // Format the date into YYYY-MM-DD format
        const formattedDate = startDate.toISOString().split('T')[0];

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
                alert(`Room: ${selectedRoom.RoomName} on ${formattedDate} at ${selectedTimeSlot} has been booked!`);
                closeModal(); // Close the modal on success
            } else {
                alert('Failed to create booking.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="px-8 py-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-center">Here are the rooms available</h2>
                <div className="grid grid-cols-2 gap-6">
                    {allRooms.filter((room) => UserRole === "Director" || room.Type === "User")
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
                                            src="/images/people-icon.png" // Replace with actual image path
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
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-2xl font-semibold mb-4">{selectedRoom.RoomName}</h2>
                        <Image
                            src={"/images/" + selectedRoom.imagename}
                            alt={selectedRoom.RoomName}
                            width={300}
                            height={200}
                            className="mb-4 rounded-md"
                        />

                        {/* Date Picker */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Date:</label>
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

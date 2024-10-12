"use client";
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BackgroundBeams } from "../ui/background-beams";
import { HoverEffect } from "../ui/card-hover-effect";


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

export const projects = [
    {
      title: "Stripe",
      description:
        "A technology company that builds economic infrastructure for the internet.",
      link: "https://stripe.com",
    },
    {
      title: "Netflix",
      description:
        "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
      link: "https://netflix.com",
    },
    {
      title: "Google",
      description:
        "A multinational technology company that specializes in Internet-related services and products.",
      link: "https://google.com",
    },
    {
      title: "Meta",
      description:
        "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
      link: "https://meta.com",
    },
  ];

const UserHomepage: React.FC<UserHomeProps> = ({ allRooms, UserRole, userID, FavRooms, allBookings }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);       // For Date Picker
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');        // Time slot selection
    const userId = userID;
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [unAvaRooms, setUnAvaRooms] = useState<number[]>([]); // To store unavailable room IDs


    const handleDateIconClick = () => {
        setShowDatePicker(!showDatePicker); 
    };

    const closeModal = () => {
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
        closeModal();
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



    return (
        <div className="min-h-screen bg-gradient-to-r bg-neutral-950 text-white relative">
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
                        <div className="absolute top-12 right-0 bg-black p-4 rounded-lg shadow-lg z-50 border border-white dark:border-white/[0.2]">
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
                
                <div className="max-w-5xl mx-auto px-8">
                    <HoverEffect 
                    items={availableRooms} 
                    UserRole={UserRole} 
                    FavRooms={FavRooms} 
                    userId={userId} 
                    startDate={startDate}
                    selectedTimeSlot={selectedTimeSlot}/>
                </div>
            </div>

            
            <BackgroundBeams />
        </div>
    );
};

export default UserHomepage;


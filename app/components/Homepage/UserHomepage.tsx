"use client";
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HoverEffect } from "../ui/card-hover-effect";
import Navbar from '../Navbar';

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
        closeModal();
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
    const unAvailableRooms = allRooms.filter((room) => unAvaRooms.includes(room.RoomID));
    console.log(unAvailableRooms);

    return (
        <div className='overflow-hidden no-scrollbar overflow-y-scroll bg-neutral-800 flex-1 ml-auto mr-auto lg:w-[1100px] h-full'>
          <Navbar />
          <div className="px-8 py-6 max-w-7xl mx-auto relative z-10">
           {/* Calendar Icon */}
            <div className="relative py-2">
                <button
                    className="absolute top-0 right-[50%] bg-neutral-900 p-2 rounded-full hover:bg-neutral-700 transition duration-300 z-20"
                    onClick={handleDateIconClick}
                >
                    <FaCalendarAlt className="text-white w-6 h-6" />
                </button>

                {/* Date Picker - Shows only when icon is clicked */}
                {showDatePicker && (
                    <div
                    className="absolute bg-neutral-900 p-4 rounded-lg shadow-lg z-50 border border-white dark:border-white/[0.2]"
                    style={{ top: "50%", left: "50%", transform: "translateX(-50%)" }} // Adjust position here
                    >
                    <div className="mb-2">
                        <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="border rounded-md p-2 w-full text-white bg-neutral-800"
                        placeholderText="Select a date"
                        minDate={new Date()}
                        onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>

                    {/* Time Slot Dropdown */}
                    <div className="mb-4">
                        <label className="block font-semibold mb-2">Time:</label>
                        <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="border rounded-md p-2 w-full text-white bg-neutral-800"
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
                        className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-md transition duration-300"
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
                unAvailableRooms={unAvailableRooms}
                UserRole={UserRole} 
                FavRooms={FavRooms} 
                userId={userId} 
                startDate={startDate}
                selectedTimeSlot={selectedTimeSlot}
                allBookings={allBookings}
              />
            </div>
          </div>
        </div>
      );
};
      

export default UserHomepage;


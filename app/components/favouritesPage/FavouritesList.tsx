'use client';
import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import TimeSlotDropdown from './TimeSlotDropdown'; // Ensure this path is correct

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  imagename: string; // Image filename or URL
}

interface FavouritesListProps {
  rooms: Room[];
  userId: number;
}

const FavouritesList: React.FC<FavouritesListProps> = ({ rooms,userId }) => {
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(''); 

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  // Function to handle booking
  const handleBooking = async (room: Room) => {
    if (!startDate || !selectedTimeSlot) {
      alert("Please select a date and time slot.");
      return;
    }

    // create Room pin
    const RoomPin = Math.floor(100 + Math.random() * 90).toString(); 
    // Format the date into YYYY-MM-DD format
    const formattedDate = startDate.toISOString().split('T')[0];

    // Here you would handle the booking logic, e.g., updating the database
    console.log(`Booking Room: ${room.RoomName}`);
    console.log(`Date: ${startDate}`);
    console.log(`Time Slot: ${selectedTimeSlot}`);
    console.log(`RoomID: ${room.RoomID}` )
    try {
      const response = await fetch('/api/createBooking', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              RoomID: room.RoomID,
              UserID: userId,
              BookingDate: formattedDate,
              BookingTime: selectedTimeSlot,
              RoomPin: RoomPin,
          }),
      });


      if (response.ok) {
                alert(`Room: ${room.RoomName} on ${formattedDate} at ${selectedTimeSlot} has been booked!`);
            } else {
                alert('Failed to create booking.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('An error occurred. Please try again.');
        }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Favourite Rooms</h2>
      <ul className="space-y-8">
        {rooms.map((room) => (
          <li key={room.RoomID} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{room.RoomName}</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              {room.imagename && (
                <div className="w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <img
                    src={"/images/" + room.imagename}
                    alt={`${room.RoomName} image`}
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between w-1/7">
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border rounded-md p-2 w-full text-black" // Adjusted width
                  placeholderText="Select a date"
                />
                <TimeSlotDropdown timeSlots={timeSlots} onChange={(slot) => setSelectedTimeSlot(slot)} />
                <p className="mt-4 text-gray-300">Pax: {room.Pax}</p>
                <button
                  onClick={() => handleBooking(room)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Book Now
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavouritesList;

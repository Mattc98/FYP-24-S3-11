'use client';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import TimeSlotDropdown from './TimeSlotDropdown'; // Ensure this path is correct


interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  imagename: string; // Image filename or URL
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

interface FavouritesListProps {
  rooms: Room[];
  userId: number;
  userRole:string;
  allBookings: Bookings[];
}

const FavouritesList: React.FC<FavouritesListProps> = ({ rooms, userId, userRole, allBookings }) => {
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(''); 
  const [userName, setName] = useState('');

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
  ];

  useEffect(() => {
    // Fetch director name from the server-side API route
    const fetchName = async () => {
        try {
            const response = await fetch('/api/getName');
            const data = await response.json();
            setName(data.username || '');
        } catch (error) {
            console.error('Error fetching name:', error);
        }
    };

    fetchName();
  }, []);

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
    
    
    return time24;
  };
    
  const formatTime = (timeRange: string) => {

    // Extract only the start time from the time range
    const [startTime] = timeRange.split(' - ');

    // Convert the start time to 24-hour format
    const startTime24 = convertTo24Hour(startTime);

    // Log the 24-hour formatted start time
    console.log(`Formatted start time: ${startTime24}`);

    // Find the matching time slot by comparing just the start time
    const matchingSlot = timeSlots.some((slot) => {
        const [slotStart] = slot.split(' - ');
        const slotStart24 = convertTo24Hour(slotStart);

        console.log(`Comparing input start (${startTime24}) with slot start (${slotStart24})`);

        return slotStart24 === startTime24;
    });

    if (matchingSlot) {
        console.log(`Matching time slot found: ${startTime24}`);
        return startTime24; // Return the original time range that matched
    }

    console.log('Time not available in slots');
    return 'Time not available in slots'; // Return an appropriate message
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

// Function to handle booking
const handleBooking = async (room: Room) => {
  if (!startDate || !selectedTimeSlot) {
      alert("Please select a date and time slot.");
      return;
  }

  // Create Room pin and format the date
  const RoomPin = Math.floor(100 + Math.random() * 90).toString(); 
  const formattedDate = startDate.toLocaleDateString('en-CA');

  const isDuplicate = allBookings.filter(
    (booking) =>
        formatDate(new Date(booking.BookingDate)) === formatDate(new Date(startDate)) &&
        formatTime(booking.BookingTime) === formatTime(selectedTimeSlot) &&
        booking.RoomID === room.RoomID
  );


  if (isDuplicate.length !== 0) {
      if (userRole === 'Director'){
        
        const directorCode = prompt('A booking already exists at this time. Please enter the Director Code to proceed:');

        if (!directorCode || directorCode !== '123') {
            alert('Invalid Director Code. Booking not overridden.');
            return;
        }

        alert('Director code is valid. Room has been overridden.');

        // Update only the UserID for the conflicting booking
        try {
            const updateResponse = await fetch('/api/updateUserID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: isDuplicate[0].BookingID,
                    newUserId: userId,
                }),
            });

            const updateData = await updateResponse.json();
            if (!updateResponse.ok || !updateData.success) {
                console.error('Failed to update UserID:', updateData.error);
                alert('Failed to override booking.');
                return;
            }

            // Send notification to the original user
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
                            roomName: room.RoomName,
                            bookingDate: formattedDate,
                            bookingTime: selectedTimeSlot,
                            directorName: userName,
                        }),
                    });
                } else {
                    console.error('Failed to retrieve user email');
                }
            } catch (error) {
                console.error('Error retrieving user email or sending notification email:', error);
            }
        } catch (error) {
            console.error('Error updating UserID for override:', error);
            alert('An error occurred while overriding the booking.');
            return;
        }
      }else{
        alert("Room has already been booked");
      }
      return; // Exit after handling the override
    }else{
      // Proceed to create a new booking if no conflict
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
              BookingTime: formatTime(selectedTimeSlot),
              RoomPin: RoomPin,
          }),
        });

        if (response.ok) {
            alert(`Room: ${room.RoomName} on ${formattedDate} at ${selectedTimeSlot} has been booked!`);
        } else {
            alert('Failed to create booking.');
            const errorData = await response.json();
            console.log('Error response data:', errorData);
        }
      } catch (error) {
          console.error('Error creating booking:', error);
          alert('An error occurred. Please try again.');
      }
    };
  }


  return (
    
    <div className='bg-neutral-800 flex-1 ml-auto mr-auto w-[70%] h-screen'>
      <h2 className="text-2xl font-bold text-white">Your Favourite Rooms</h2>
      <ul className="space-y-8">
        {rooms.map((room) => (
          <li key={room.RoomID} className="bg-neutral-900 p-6 rounded-lg shadow-xl shadow-black-500/50">
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
                  minDate={new Date()} 
                  onKeyDown={(e) => e.preventDefault()}
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

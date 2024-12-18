import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'sonner';
import { getUserEmail, createBooking, favRoom, overrideBooking } from "@/app/data-access/dashboard";


const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
];

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
    BGP: string;
}

interface Bookings {
  BookingID: number;
  RoomID: number;
  UserID: string;
  BookingDate: string;
  BookingTime: string;
  RoomPin: number;
  BiometricPassword: number;
  BGP: string;
}

export const HoverEffect = ({
  items,
  unAvailableRooms,
  UserRole,
  FavRooms,
  userId,
  startDate,
  selectedTimeSlot,
  allBookings,
  username,
  className,
}: {
  items: Room[];
  unAvailableRooms: Room[];
  UserRole :string;
  FavRooms: number[];
  userId: number;
  startDate: Date | null;
  selectedTimeSlot: string | null;
  allBookings: Bookings[];
  username: string;
  className?: string;
  
  
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // Modal control
    const [selectedOverrideRoom, setOverrideSelectedRoom] = useState<Room | null>(null); // Modal control
    const [isFavorite, setIsFavorite] = useState(false);
    const [bookedUser, setBookedUser] = useState<string | null>(null);


    // Update favorite state when selectedRoom changes
    useEffect(() => {
        if (selectedRoom) {
            setIsFavorite(FavRooms.includes(selectedRoom.RoomID)); // Check if the selected room is a favorite
        }
    }, [selectedRoom, FavRooms]);

    
    const handleOverrideRoomClick = async (room: Room) => {
        setOverrideSelectedRoom(room); 
        if (!startDate || !selectedTimeSlot) {
            toast.error("Please select a date and time.");
            return;
        }


        const booking = allBookings.find(
            (booking) => 
                formatDate(new Date(booking.BookingDate)) === formatDate(new Date(startDate)) &&
                formatTime(booking.BookingTime) === formatTime(selectedTimeSlot) &&
                booking.RoomID === room.RoomID
        );

        const userIdNumber = booking ? Number(booking.UserID) : 0; 
        const user = await getUserEmail(userIdNumber); 
        setBookedUser(user.Email);
    };

    const handleRoomClick = (room: Room) => {
      setSelectedRoom(room);
    };

    const closeModal = () => {
        setSelectedRoom(null);
        setOverrideSelectedRoom(null);
    };
    
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
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
        
        const time24 = `${hoursIn24.toString().padStart(2, '0')}:${minutes}`;
        
        // Log the conversion process
        console.log(`Converted ${time} to 24-hour format: ${time24}`);
        
        return time24;
    };
        
    const formatTime = (timeRange: string) => {
        console.log(`Input time to format: ${timeRange}`);

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
    
    const handleBooking = async () => {
        if (!startDate || !selectedTimeSlot) {
            toast.error("Please select a date and time.");
            return;
        }
    
        const thisRoom = selectedRoom || selectedOverrideRoom;
    
        if (!thisRoom) {
            toast.error("Please select a room.");
            return;
        }
    
        // Check for duplicate bookings
        const isDuplicate = allBookings.filter(
            (booking) =>
                formatDate(new Date(booking.BookingDate)) === formatDate(new Date(startDate)) &&
                formatTime(booking.BookingTime) === formatTime(selectedTimeSlot) &&
                booking.RoomID === thisRoom.RoomID
        );
    
        if (isDuplicate.length !== 0) {
            const directorCode = prompt('A booking already exists at this time. Please enter the Director Code to proceed:');
    
            if (!directorCode || directorCode !== '123') {
                toast.error('Invalid Director Code. Booking not overridden.');
                return;
            }

            try{
                overrideBooking(isDuplicate[0].BookingID, userId, isDuplicate[0].UserID, thisRoom.RoomName, formatDate(new Date(startDate)), selectedTimeSlot, username);
                toast.success('Director code is valid. Room has been overridden.');
            }catch(error){
                console.error('Error updating UserID for override:', error);
                alert('An error occurred while overriding the booking.');
                return;
            };
        }else{
             // Create room pin and format date and time
            const RoomPin = Math.floor(100 + Math.random() * 90).toString();
            const formattedDate = startDate.toLocaleDateString('en-CA');
            const timeIn24HourFormat = formatTime(selectedTimeSlot);
        
            // Create a new booking if no duplicate was found
            try {
                createBooking(thisRoom.RoomID , userId, formattedDate, timeIn24HourFormat, RoomPin, thisRoom.BGP, thisRoom.RoomName, selectedTimeSlot);
                closeModal();
            } catch (error) {
                console.error('Error creating booking:', error);
                alert('An error occurred. Please try again.');
            }
        }
        window.location.href = "/dashboard";
    };
    
    const handleFavorite = async (room: Room) => {
        try {
            setIsFavorite(await favRoom(isFavorite, userId, room.RoomID));
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

  return (
    <div>
        <h1 className="text-white text-xl">Avaliable rooms</h1>
        <div
        className={cn(
            "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10",
            className
        )}
        >
            {items.filter((room) => UserRole === "Director" || room.Type === "User")
            .map((item, idx) => (
                <Link
                href=""
                key={item?.RoomID}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleRoomClick(item)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                        <motion.span
                            className="absolute inset-0 h-full w-full bg-neutral-600 dark:bg-slate-800/[0.8] block rounded-3xl"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{
                            opacity: 1,
                            transition: { duration: 0.15 },
                            }}
                            exit={{
                            opacity: 0,
                            transition: { duration: 0.15, delay: 0.2 },
                            }}
                        />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{item.RoomName}</CardTitle>
                        <Image
                            src={item.imagename}
                            alt={item.RoomName}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                        />
                        <CardDescription>Room Pax: {item.Pax}</CardDescription>
                    </Card>
                </Link>
            ))} 
        
            
            {/* Modal for Room Booking */}
            {selectedRoom && (
                    <div className="fixed inset-0 bg-neutral-800 bg-opacity-10 flex items-center justify-center z-50">
                        <div 
                            className="bg-black p-6 rounded-lg shadow-lg text-white"
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
                                src={selectedRoom.imagename}
                                alt={selectedRoom.RoomName}
                                width={300}
                                height={200}
                                className="mb-4 rounded-md"
                            />
                            {/* Buttons */}
                            <div className="flex justify-between">
                                <button
                                    className="border hover:bg-white hover:text-black bg-black text-white px-4 py-2 rounded-md transition duration-300"
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
            <Toaster richColors/>
        </div>
        <h1 className="text-white text-xl">Unavaliable rooms</h1>
        <div
        className={cn(
            "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-10",
            className
        )}>
            {unAvailableRooms.filter((room) => UserRole === "Director" || room.Type === "User")
            .map((room, idx) => (
                <Link
                    href=""
                    key={room?.RoomID}
                    className="relative group block p-2 h-full w-full"
                    onMouseEnter={() => setHoveredIndex(idx + items.length)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleOverrideRoomClick(room)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx + items.length && (  // Correct comparison here
                            <motion.span
                                className="absolute inset-0 h-full w-full bg-neutral-700 dark:bg-slate-800/[0.8] block rounded-3xl"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <Card>
                        <CardTitle>{room.RoomName}</CardTitle>
                        <Image
                            src={room.imagename}
                            alt={room.RoomName}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                        />
                        <CardDescription>
                            Room Pax: {room.Pax}
                        </CardDescription>
                    </Card>
                </Link>
            ))}

            {selectedOverrideRoom && (
                <div className="fixed inset-0 bg-neutral-800 bg-opacity-10 flex items-center justify-center z-50">
                    <div 
                        className="bg-black p-6 rounded-lg shadow-lg text-white"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{selectedOverrideRoom.RoomName}</h2>
                            <button
                                className={`flex items-center justify-center w-8 h-8 transition duration-300 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                                onClick={() => {
                                    handleFavorite(selectedOverrideRoom); // Update favorites when clicked
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
                            src={selectedOverrideRoom.imagename}
                            alt={selectedOverrideRoom.RoomName}
                            width={300}
                            height={200}
                            className="mb-4 rounded-md"
                        />
                        <br/>
                        <p>
                            Booked by:{bookedUser}
                        </p>
                        <br/>
                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button
                                className={`border hover:bg-white hover:text-black bg-red-700 text-black px-4 py-2 rounded-md transition duration-300 ${
                                    UserRole !== "Director" ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={handleBooking}
                                disabled={UserRole !== "Director"} // Disable button if not Director
                            >
                                Override
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
    </div>
    
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-neutral-900 border border-transparent dark:border-black/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50 text-zinc-200">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("item-center justifiy-center text-zinc-200 font-bold tracking-wide mt-4", className)}>
      -{children}-
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-200 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

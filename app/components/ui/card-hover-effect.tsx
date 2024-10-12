import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';


interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
}
export const handleRoomClick = (room: Room) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // Modal control
    setSelectedRoom(room); 
};


export const HoverEffect = ({
  items,
  UserRole,
  FavRooms,
  userId,
  startDate,
  selectedTimeSlot,
  className,
}: {
  items: Room[];
  UserRole :string;
  FavRooms: number[];
  userId: number;
  startDate: Date | null;
  selectedTimeSlot: string | null;
  className?: string;
  
  
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); // Modal control
    const [isFavorite, setIsFavorite] = useState(false);

    const handleRoomClick = (room: Room) => {
    setSelectedRoom(room); 
    };

    const closeModal = () => {
        setSelectedRoom(null);
    };
      
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    
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
                closeModal();
            } else {
                alert('Failed to create booking.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('An error occurred. Please try again.');
        }
    };

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

    // Update favorite state when selectedRoom changes
    useEffect(() => {
        if (selectedRoom) {
            setIsFavorite(FavRooms.includes(selectedRoom.RoomID)); // Check if the selected room is a favorite
        }
    }, [selectedRoom, FavRooms]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.filter((room) => UserRole === "Director" || room.Type === "User")
        .map((item, idx) => (
            <Link
            href=""
            key={item?.RoomID}
            className="relative group  block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => handleRoomClick(item)}
            >
            <AnimatePresence>
                {hoveredIndex === idx && (
                <motion.span
                    className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
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
                    src={"/images/" + item.imagename}
                    alt={item.RoomName}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                />
                <CardDescription>pax: {item.Pax}</CardDescription>
            </Card>
            </Link>
        ))}

        {/* Modal for Room Booking */}
        {selectedRoom && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div 
                        className="bg-black p-6 rounded-lg shadow-lg text-white"
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
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
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
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
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
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

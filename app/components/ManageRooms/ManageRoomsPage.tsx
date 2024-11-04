'use client';
import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;
    BGP: string;
}

interface Feedback {
    UserID: number; // Assuming UserID is a number
    Feedback: string;
}

interface UserAccount {
    UserID: number;
    Username: string;
    Role: string;
}

const ManageRoomsPage = ({ rooms: initialRooms }: { rooms: Room[] }) => {
    const [rooms, setRooms] = useState<Room[]>(initialRooms);
    const [newRoomName, setNewRoomName] = useState<string>('');
    const [newPax, setNewPax] = useState<number | string>('');
    const [newType, setNewType] = useState<string>('');
    const [newStatus, setNewStatus] = useState<string>('');
    const [newImageName, setNewImageName] = useState<string>('');
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [, setUsers] = useState<UserAccount[]>([]); // State to store users


    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/manageUsers'); // Adjust the path as necessary
            if (response.ok) {
                const usersData = await response.json();
                setUsers(usersData);
            }
        };
        fetchUsers();
    }, []);

    /*const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImageName(reader.result as string); // Set the Base64 string
            };
            reader.readAsDataURL(file);
        }
    };*/

    // utils/generatePin.js

    const generateMasterPin = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pin = "";
    
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pin += characters[randomIndex];
        }
        
        
        return pin;
    };

    const handleGeneratePin = () => {
        const newPin = generateMasterPin();
        setEditRoom((prev: Room | null) => {
            if (prev) {
                return {
                    ...prev,
                    BGP: newPin,
                };
            }
            return null; // Return null if prev is null
        });
    };

    
    

    const handleAddRoom = async () => {
        if (!newRoomName || !newPax || !newType || !newStatus || !newImageName) {
            toast.error("Please fill in all fields.");
            return; // Stop execution if any field is missing
        }
    
        const pin = generateMasterPin();

        const response = await fetch(`/api/manageRooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                RoomName: newRoomName,
                Pax: Number(newPax),
                Type: newType,
                Status: newStatus,
                imagename: newImageName,
                BGP: pin,
            }),
        });

        if (response.ok) {
            const addedRoom = await response.json();
            setRooms((prevRooms) => [...prevRooms, addedRoom]);
            setNewRoomName('');
            setNewPax('');
            setNewType('');
            setNewStatus('');
            setNewImageName('');
            setIsAddModalOpen(false);
            toast.success('Successfully added new room');
        }
    };

    const handleEditRoom = async (roomId: number) => {
        if (editRoom) {
            console.log('Editing room with ID:', roomId, 'Values:', editRoom); // Log current values

            const response = await fetch(`/api/manageRooms`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ...editRoom, 
                    RoomID: roomId 
                }),
            });
            

            if (response.ok) {
                // Update rooms list state
                setRooms(rooms.map(room => 
                    room.RoomID === roomId ? { ...room, ...editRoom } : room
                ));
                setEditRoom(null);
                setIsEditModalOpen(false);
                toast.success('Successfully updated room details');
            } else {
                const errorData = await response.json();
                console.error('Failed to update room:', errorData.message);
            }
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        const response = await fetch(`/api/manageRooms`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ RoomID: roomId }),
        });

        if (response.ok) {
            setRooms((prevRooms) => prevRooms.filter((room) => room.RoomID !== roomId));
            toast.success('Successfully deleted room');
        }
    };

    const handleViewFeedback = async (roomId: number) => {
        const response = await fetch(`/api/viewFeedback?roomId=${roomId}`);
        if (response.ok) {
            const feedbackData = await response.json();
            setFeedback(feedbackData);
            setSelectedRoomId(roomId);
            setIsFeedbackModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-800 text-white p-6">
            <h1 className="text-3xl font-semibold mb-6 text-white">Manage Rooms</h1>

            {/* Add Room Button */}
            <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-green-600"
                onClick={() => setIsAddModalOpen(true)}
            >
                Add New Room
            </button>

            {/* Rooms Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.RoomID} className="bg-neutral-900 rounded-lg text-white p-4 shadow-lg">
                        {room.imagename && (
                            <img
                                src={"/images/" + room.imagename}
                                alt={room.RoomName}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                        )}
                        <h2 className="text-xl font-bold">{room.RoomName}</h2>
                        <p className="text-sm">Pax: {room.Pax}</p>
                        <p className="text-sm">Type: {room.Type}</p>
                        <p className="text-sm">Status: {room.Status}</p>
                        <p className="text-sm">Master Pin: {room.BGP}</p>
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 text-white py-1 px-3 rounded-lg mr-2 hover:bg-blue-600"
                                onClick={() => {
                                    setEditRoom(room);
                                    setIsEditModalOpen(true);
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                                onClick={() => handleDeleteRoom(room.RoomID)}
                            >
                                Delete
                            </button>
                            <button
                                className="bg-purple-500 text-white py-1 px-3 rounded-lg ml-2 hover:bg-purple-600"
                                onClick={() => handleViewFeedback(room.RoomID)} // Open feedback modal
                            >
                                View Feedback
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Room Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
                        <label className="block font-medium">Room Name</label>
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        />
                        <label className="block font-medium">Pax</label>
                        <input
                            type="number"
                            value={newPax}
                            onChange={(e) => {
                                const value = Math.max(0, Number(e.target.value)); // Ensure the value is non-negative
                                setNewPax(value);
                            }}
                            min="0" // Set minimum value to 0
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        />
                        <label className="block font-medium">Type</label>
                        <select
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        >
                            <option value="" disabled>Select Type</option>
                            <option value="User">User</option>
                            <option value="Director">Director</option>
                        </select>
                        <label className="block font-medium">Status</label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                            onClick={handleAddRoom}
                        >
                            Add Room
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg ml-2 hover:bg-red-600"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Room Modal */}
            {isEditModalOpen && editRoom && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Edit Room</h2>
                        <label className="block font-medium">Room Name</label>
                        <input
                            type="text"
                            value={editRoom.RoomName}
                            onChange={(e) => setEditRoom({ ...editRoom, RoomName: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        />
                        <label className="block font-medium">Pax</label>
                        <input
                            type="number"
                            value={editRoom.Pax}
                            onChange={(e) => setEditRoom({ ...editRoom, Pax: Number(e.target.value) })}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        />
                        <label className="block font-medium">Type</label>
                        <select
                            value={editRoom.Type}
                            onChange={(e) => setEditRoom({ ...editRoom, Type: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        >
                            <option value="User">User</option>
                            <option value="Director">Director</option>
                        </select>
                        <label className="block font-medium">Status</label>
                        <select
                            value={editRoom.Status}
                            onChange={(e) => setEditRoom({ ...editRoom, Status: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full rounded text-black"
                        >
                            <option value="Available">Available</option>
                            <option value="Unavailable">Unavailable</option>
                        </select>

                        <label className="block font-medium">Master Pin</label>
                        <div className="relative mb-2">
                        <input
                            type="text"
                            value={editRoom.BGP}
                            readOnly
                            className="border p-2 pr-16 w-full rounded text-black"
                            />
                        <button
                        className="absolute right-0 top-0 bottom-0 bg-green-500 text-white py-0 px-2 rounded-lg hover:bg-green-400"
                        onClick={handleGeneratePin}
                        >
                        Generate Pin
                        </button>
                        </div>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            onClick={() => handleEditRoom(editRoom.RoomID)}
                        >
                            Update Room
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg ml-2 hover:bg-red-600"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-700 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Feedback for Room {selectedRoomId}</h2>
                        <ul>
                            {feedback.map((fb) => (
                                <li key={fb.UserID} className="mb-2">
                                    <strong>User {fb.UserID}:</strong> {fb.Feedback}
                                </li>
                            ))}
                        </ul>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            onClick={() => setIsFeedbackModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            <Toaster richColors/>
        </div>
    );
};

export default ManageRoomsPage;
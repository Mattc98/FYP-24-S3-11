'use client';
import React, { useEffect, useState } from 'react';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string; // This should be the image URL or path
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
    const [users, setUsers] = useState<UserAccount[]>([]); // State to store users

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
    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImageName(reader.result as string); // Set the Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddRoom = async () => {
        const response = await fetch('/api/manageRooms', {
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
        }
    };

    const handleEditRoom = async (roomId: number) => {
        if (editRoom) {
            const response = await fetch('/api/manageRooms', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editRoom, RoomID: roomId }),
            });

            if (response.ok) {
                setRooms(rooms.map(room => (room.RoomID === roomId ? { ...editRoom } : room)));
                setEditRoom(null);
                setIsEditModalOpen(false);
            }
        }
    };

    const handleDeleteRoom = async (roomId: number) => {
        const response = await fetch('/api/manageRooms', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ RoomID: roomId }),
        });

        if (response.ok) {
            setRooms((prevRooms) => prevRooms.filter((room) => room.RoomID !== roomId));
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
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-6">
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
                    <div key={room.RoomID} className="bg-gray-800 rounded-lg text-white p-4 shadow-lg">
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
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="number"
                            placeholder="Pax"
                            value={newPax}
                            onChange={(e) => setNewPax(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="text"
                            placeholder="Type"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e)}
                            className="border p-2 mr-2 mb-2 w-full text-white"
                        />

                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                            onClick={handleAddRoom}
                        >
                            Add Room
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 ml-2"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Room Modal */}
            {isEditModalOpen && editRoom && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Edit Room</h2>
                        <input
                            type="text"
                            placeholder="Room Name"
                            value={editRoom.RoomName}
                            onChange={(e) => setEditRoom({ ...editRoom, RoomName: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="number"
                            placeholder="Pax"
                            value={editRoom.Pax}
                            onChange={(e) => setEditRoom({ ...editRoom, Pax: Number(e.target.value) })}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="text"
                            placeholder="Type"
                            value={editRoom.Type}
                            onChange={(e) => setEditRoom({ ...editRoom, Type: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={editRoom.Status}
                            onChange={(e) => setEditRoom({ ...editRoom, Status: e.target.value })}
                            className="border p-2 mr-2 mb-2 w-full text-black"
                        />
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            onClick={() => handleEditRoom(editRoom.RoomID)}
                        >
                            Save Changes
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 ml-2"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

           {/* Feedback Modal */}
           {isFeedbackModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3 text-white">
                        <h2 className="text-xl font-semibold mb-4">Feedback for Room ID: {selectedRoomId}</h2>
                        <div className="max-h-64 overflow-y-auto mb-4">
                            {feedback.map((item) => {
                                const user = users.find(user => user.UserID === item.UserID);
                                return (
                                    <div key={item.UserID} className="border-b border-gray-700 py-2">
                                        <p className="font-bold">User: {user ? user.Username : 'Unknown'}</p>
                                        <p>{item.Feedback}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            onClick={() => setIsFeedbackModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRoomsPage;
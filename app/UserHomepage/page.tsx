
import React from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import { calluser } from '@/aws_db/db';


async function fetchuser() {
  try {
    const response = await calluser("SELECT * FROM Room");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}

interface rooms {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
  imagename: string;
}
  

export default async function UserHomepage()  {

    const roompic = [
        {
          name: 'Meeting room',
          image: '/images/meeting-room.jpg', // Updated path
          capacity: 6,
        },
        {
          name: 'Conference Room',
          image: '/images/conference-room.jpg', // Updated path
          capacity: 17,
        },
        {
          name: 'Large room',
          image: '/images/large-room.jpg', // Updated path
          capacity: 8,
        },
        {
          name: 'Big Room',
          image: '/images/big-room.jpg', // Updated path
          capacity: 8,
        },
      ];

      const allrooms:rooms[] = await fetchuser();

    return (

        <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-gray-500 text-white flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
            <div className="text-2xl font-bold">Welcome back, Ryzlan</div>
            </div>
            <div className="flex items-center space-x-6">
            {/* Profile Icon */}
            <div>
                <Image
                src="/images/profile-icon.png" // Replace with actual image
                alt="Profile"
                width={64}
                height={64}
                />
          </div>
          </div>
      </div>

      {/* Menu Icons */}
      <div className="bg-gray-300 flex justify-center items-center py-3 space-x-8">
          <Navbar/>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
          <h2 className="text-lg font-semibold mb-4">Here are the rooms available</h2>
          <div className="flex justify-between items-center mb-6">
          <span className="text-gray-500">9 August 2024</span>
          <Image src="/calendar-icon.png" alt="Calendar" width={24} height={24} />
          </div>
          <div className="grid grid-cols-2 gap-4">
          {allrooms.map((room) => (
              <div key={room.RoomName} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                  src={room.imagename}
                  alt={room.RoomName}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
              />
              <div className="p-4">
                  <h3 className="text-lg font-semibold">{room.RoomName}</h3>
                  <div className="flex items-center mt-2">
                  <Image
                      src="/people-icon.png" // Replace with actual image path
                      alt="Capacity"
                      width={20}
                      height={20}
                  />
                  <span className="ml-2 text-sm">{room.Pax}</span>
                  </div>
              </div>
              </div>
          ))}
          </div>
      </div>
      </div>
  );
};


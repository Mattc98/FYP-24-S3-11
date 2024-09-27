import Image from 'next/image';
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import React, { Suspense } from 'react';

async function fetchRoom() {
  try {
    const response = await calluser("SELECT * FROM Room");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch room data.');
  }
}

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
  imagename: string;
}

export default async function UserHomepage() {
  const allRooms: Room[] = await fetchRoom();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-300 flex justify-center items-center py-3 space-x-8">
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="bg-gray-600 px-8 py-6">
        <h2 className="text-lg font-semibold mb-4">Here are the rooms available</h2>
        <div className="grid grid-cols-2 gap-4">
          {allRooms.map((room) => (
            <div key={room.RoomName} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={room.imagename}
                alt={room.RoomName}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="bg-gray-600 p-4">
                <h3 className="text-lg font-semibold">{room.RoomName}</h3>
                <div className="flex items-center mt-2">
                  <Image
                    src="/people-icon.png" // Replace with actual image path
                    alt="Capacity"
                    width={20}
                    height={20}
                  />
                  <span className="bg-gray-600 ml-2 text-sm">{room.Pax}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
import UserHome from "../components/Homepage/UserHomepage";
import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import React, { Suspense } from 'react';

interface Room {
  RoomID: number;
  RoomName: string;
  Pax: number;
  Type: string;
  Status: string;
  imagename: string;
}

interface userAccount{
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director";
}

async function fetchRoom() {
  try {
    const response = await calluser("SELECT * FROM Room");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch room data.');
  }
}

// Fetch user ID by username
const fetchUserRoleByUsername = async (username: string): Promise<string | undefined> => {
  const response = await calluser(`SELECT Role FROM userAccount WHERE Username = '${username}'`);
  return (response as userAccount[])[0]?.Role;
};

const fetchUserIdByUsername = async (username: string): Promise<number | undefined> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as userAccount[])[0]?.UserID;
};

export default async function UserHomepage({ searchParams }: { searchParams: { username: string } }) {
  const allRooms: Room[] = await fetchRoom();
  const { username } = searchParams;

  if (!username) {
    return <p>No username provided.</p>;
  }

  const UserRole = await fetchUserRoleByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserRole = typeof UserRole === 'string' ? UserRole : undefined; // Ensure it's a number

  if (parsedUserRole === undefined) {
    return <p>User does not have a role.</p>;
  }

  const userId = await fetchUserIdByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }
  
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-gray-300 flex justify-center items-center py-3 space-x-8">
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      </div>

      {/* Main Content */}
      <div>
        <UserHome allRooms={allRooms} UserRole={parsedUserRole} userID={parsedUserId}/>
      </div>
    </div>
  );
}
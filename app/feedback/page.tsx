import styles from '@/app/components/Feedback/Feedback.module.css';
import RoomDropdown from '@/app/components/Feedback/RoomDropdown';
import FeedbackForm from '@/app/components/Feedback/FeedbackForm';
import Navbar from '../components/Navbar';
import React, { Suspense } from 'react';
import { calluser } from '@/aws_db/db'; // Ensure this is correctly imported
import { Vortex } from '../components/ui/vortex';
import { cookies } from 'next/headers'


interface UserAccount {
  UserID: number;
  Username: string;
  Role: "User" | "Admin" | "Director";
}

const fetchUserIdByUsername = async (username: string): Promise<number> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as UserAccount[])[0]?.UserID; // Use UserID key here
};

const fetchUserRoleByUsername = async (username: string): Promise<string | undefined> => {
  const response = await calluser(`SELECT Role FROM userAccount WHERE Username = '${username}'`);
  return (response as UserAccount[])[0]?.Role;
};

export default async function Feedback() {
  const cookieStore = cookies()
  const username = JSON.parse(JSON.stringify(cookieStore.get('username')));

  if (!username.value) {
    return <p>No username provided.</p>;
  }
  const userId = await fetchUserIdByUsername(username.value); // Fetch user ID
  
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }

  const userRole = await fetchUserRoleByUsername(username.value);
  // Explicitly ensure userId is a number
  const parsedUserRole = typeof userRole === 'string' ? userRole : undefined; // Ensure it's a number

  if (parsedUserRole === undefined) {
    return <p>User does not have a role.</p>;
  }

   
  return (

    <div className="flex bg-fixed w-full h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="w-full h-screen z-0"
        >
          {/* Navbar */}
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar username={username.value}/>
          </Suspense>
          <div className="flex flex-col justify-center items-center h-screen lg:w-[1100px] mx-auto bg-neutral-800">
            <h1 className={styles.pageHeading}>Share your feedback</h1>
            <FeedbackForm userId={parsedUserId}>
              <RoomDropdown UserRole={parsedUserRole}/>
            </FeedbackForm>
          </div>
        </Vortex>
    </div>
  );
}
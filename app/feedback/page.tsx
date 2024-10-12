import styles from '@/app/components/Feedback/Feedback.module.css';
import RoomDropdown from '@/app/components/Feedback/RoomDropdown';
import FeedbackForm from '@/app/components/Feedback/FeedbackForm';
import Navbar from '../components/Navbar';
import React, { Suspense } from 'react';
import { calluser } from '@/aws_db/db'; // Ensure this is correctly imported

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

export default async function Feedback({ searchParams }: { searchParams: { username: string } }) {
  const { username } = searchParams; // Extract username from params

  if (!username) {
    return <p>No username provided.</p>;
  }
  const userId = await fetchUserIdByUsername(username); // Fetch user ID
  
  // Explicitly ensure userId is a number
  const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number

  if (parsedUserId === undefined) {
    return <p>User not found.</p>;
  }

  const userRole = await fetchUserRoleByUsername(username);
  // Explicitly ensure userId is a number
  const parsedUserRole = typeof userRole === 'string' ? userRole : undefined; // Ensure it's a number

  if (parsedUserRole === undefined) {
    return <p>User does not have a role.</p>;
  }

   
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Navbar */}
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      <div className={styles.container}>
        <h1 className={styles.pageHeading}>Share your feedback</h1>
        <FeedbackForm userId={parsedUserId}>
          <RoomDropdown UserRole={parsedUserRole}/>
        </FeedbackForm>
      </div>
    </div>
  );
}
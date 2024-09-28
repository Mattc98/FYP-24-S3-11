import styles from '@/app/components/Feedback/Feedback.module.css';
import RoomDropdown from '@/app/components/Feedback/RoomDropdown';
import FeedbackForm from '@/app/components/Feedback/FeedbackForm';
import Navbar from '../components/Navbar';
import React, { Suspense } from 'react';
import { calluser } from '@/aws_db/db'; // Ensure this is correctly imported

interface UserAccount {
  UserID: number;
  Username: string;
}

const fetchUserIdByUsername = async (username: string): Promise<number> => {
  const response = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`);
  return (response as UserAccount[])[0]?.UserID; // Use UserID key here
};

export default async function Feedback({ searchParams }: { searchParams: { username: string } }) {
  const { username } = searchParams; // Extract username from params
  const userId = await fetchUserIdByUsername(username); // Fetch user ID
  
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
      <div className={styles.container}>
        <h1 className={styles.pageHeading}>Share your feedback</h1>
        <FeedbackForm userId={userId}>
          <RoomDropdown />
        </FeedbackForm>
      </div>
    </div>
  );
}
import styles from '@/app/components/Feedback/Feedback.module.css';
import RoomDropdown from '@/app/components/Feedback/RoomDropdown';
import FeedbackForm from '@/app/components/Feedback/FeedbackForm';
import Navbar from '../components/Navbar';
import React, { Suspense } from 'react';

export default function Feedback({ params }: { params: { userId: string } }) {
  const userId = parseInt(params.userId, 10);

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
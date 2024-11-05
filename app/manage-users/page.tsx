import React, { Suspense } from 'react';
import { calluser } from '@/aws_db/db';
import ManageUsersClient from '../components/manageUsers/ManageUsersClient'; // Ensure correct path
import AdminNavbar from '../components/adminNavbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface User {
  UserID: number;
  Username: string;
  Password: string;
  Email: string;
  Role: string; // Assuming users have roles
  ProfilePicture: string; // Assuming there's a profile picture URL
  FailLogin: number;
  IsLocked: boolean;
}

// Fetch all users from the database
const fetchUser = async (): Promise<User[]> => {
  try {
    const response = await calluser("SELECT * FROM userAccount");
    return JSON.parse(JSON.stringify(response)); // Ensure proper formatting
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const ManageUsersPage = async () => {
  const cookieStore = cookies();
  const usernameCookie = cookieStore.get('username');

  if (!usernameCookie) {
    // If the username cookie doesn't exist, redirect to the home page
    redirect('/');
  }

  // Parse the cookie if it exists
  const username = JSON.parse(JSON.stringify(usernameCookie));
  
  if (!username?.value) {
    // If there's no valid value in the cookie, redirect to home
    redirect('/');
  }

  // Fetch all users
  const allUsers = await fetchUser();

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminNavbar/>
      </Suspense>

      {/* Pass fetched users as props */}
      <ManageUsersClient users={allUsers} />
    </div>
  );
};

export default ManageUsersPage;

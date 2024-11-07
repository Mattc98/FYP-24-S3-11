import React, { Suspense } from 'react';
import ManageUsersClient from '../components/manageUsers/ManageUsersClient'; // Ensure correct path
import AdminNavbar from '../components/adminNavbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserList } from '../data-access/users';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string;
  Email: string;
  Role: string;
  Status: null;
  FailLogin: number;
  IsLocked: boolean;
}

const ManageUsersPage = async () => {
  const cookieStore = cookies();
  const usernameCookie = cookieStore.get('username');

  if (!usernameCookie) {
    // If the username cookie doesn't exist, redirect to the home page
    redirect('/login-page');
  }

  // Parse the cookie if it exists
  const username = JSON.parse(JSON.stringify(usernameCookie));
  
  if (!username?.value) {
    // If there's no valid value in the cookie, redirect to home
    redirect('/login-page');
  }

  // Fetch all users
  const allUsers:UserAccount[] = await getUserList();

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

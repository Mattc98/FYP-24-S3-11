import React, { Suspense } from 'react';
import ManageUsersClient from '../components/manageUsers/ManageUsersPage';
import AdminNavbar from '../components/adminNavbar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ManageUsersPage = async ()  => {
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

    if (!username.value) {
      return <p>No username provided.</p>;
    }


  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
          <AdminNavbar/>
      </Suspense>
      <ManageUsersClient />
    </div>
  );
};

export default ManageUsersPage;
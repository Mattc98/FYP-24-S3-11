import { calluser } from '@/aws_db/db';
import React, { Suspense } from 'react';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection
import AdminHome from "../components/Homepage/AdminHomepage";

interface userAccount{
    UserID: number;
    Username: string;
    Password: string;
    Role: "User" | "Admin" | "Director";
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

// Ensure to wrap the default export in a Suspense boundary
export default async function AdminHomepage() {

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
  
    const UserRole = await fetchUserRoleByUsername(username.value);
    // Explicitly ensure userId is a number
    const parsedUserRole = typeof UserRole === 'string' ? UserRole : undefined; // Ensure it's a number
  
    if (parsedUserRole === undefined) {
      return <p>User does not have a role.</p>;
    }
  
    const userId = await fetchUserIdByUsername(username.value);
    // Explicitly ensure userId is a number
    const parsedUserId = typeof userId === 'number' ? userId : undefined; // Ensure it's a number
  
    if (parsedUserId === undefined) {
      return <p>User not found.</p>;
    }
    
    return (
        
        <Suspense fallback={<div>Loading...</div>}>
            <AdminHome />
        </Suspense>
    );
}

// This ensures that the page is not pre-rendered
export const dynamic = 'force-dynamic';

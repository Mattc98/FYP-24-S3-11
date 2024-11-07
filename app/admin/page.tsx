import React, { Suspense } from 'react';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection
import AdminHome from "../components/Homepage/AdminHomeClient";

// Ensure to wrap the default export in a Suspense boundary
export default async function AdminHomepage() {

    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the login page
      redirect('/login-page');
    }
    
    
    return (
        
        <Suspense fallback={<div>Loading...</div>}>
            <AdminHome />
        </Suspense>
    );
}

// This ensures that the page is not pre-rendered
export const dynamic = 'force-dynamic';

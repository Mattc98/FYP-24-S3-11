import RoomDropdown from '@/app/components/Feedback/RoomDropdown';
import FeedbackForm from '@/app/components/Feedback/FeedbackForm';
import Navbar from '../components/Navbar';
import React from 'react';
import { Vortex } from '../components/ui/vortex';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

// DAL
import { getUserInfo } from '../data-access/users';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default async function Feedback() {

  try {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/login-page');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    const userInfo = await getUserInfo(username.value);
    
    return (
      <div className="flex bg-fixed w-full h-screen overflow-hidden">
          <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={120}
            className="w-full h-screen z-0"
          >
            <Navbar />
            <div className="flex flex-col justify-center items-center h-screen lg:w-[1100px] mx-auto bg-neutral-800">
              <FeedbackForm userId={userInfo[0].UserID}>
                <RoomDropdown UserRole={userInfo[0].Role}/>
              </FeedbackForm>
            </div>
          </Vortex>
      </div>
    );

  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/login-page'); // Redirect to the home page on error
  }
}
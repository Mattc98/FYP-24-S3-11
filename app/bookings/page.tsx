import React from 'react'
import Bookings from '../components/myBookings/myBookingsPage'
import { Vortex } from "../components/ui/vortex";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

// DAL
import { getRooms, getBookings } from '../data-access/rooms';
import { getUserInfo } from '../data-access/users';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

  
const myBookings = async () => {

  try {
    const cookieStore = cookies();
    const usernameCookie = cookieStore.get('username');

    if (!usernameCookie) {
      // If the username cookie doesn't exist, redirect to the home page
      redirect('/login');
    }

    // Parse the cookie if it exists
    const username = JSON.parse(JSON.stringify(usernameCookie));
    const userInfo = await getUserInfo(username.value);

    // get all bookings and rooms from db
    const allBookings = await getBookings();
    const allRooms = await getRooms();
    
    return (
        <div className="flex w-full min-h-screen overflow-hidden">
          <Vortex
           backgroundColor="black"
           rangeY={800}
           particleCount={500}
           baseHue={120}
           className="w-full h-screen"
         >
            <div className='min-h-screen flex-1 ml-auto mr-auto pb-9'>
              <Bookings
                  bookings={allBookings}
                  rooms={allRooms}
                  userid={JSON.stringify(userInfo.UserId)}
                  username={username.value}
                  userRole={userInfo.Role}
                />
            </div>
         </Vortex>
       </div>
       
    )

  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/login'); // Redirect to the home page on error
  }
}

export default myBookings

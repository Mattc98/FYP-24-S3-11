import React from 'react';
import Navbar from '../components/Navbar';
import FavouritesList from '../components/favouritesPage/FavouritesList'; // Import your client component
import { Vortex } from '../components/ui/vortex';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'; // Use for server-side redirection

// DAL
import { getUserFavList, getBookings } from '../data-access/rooms';
import { getUserInfo } from '../data-access/users';


export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface RoomDetails {
  RoomID: number;
  RoomName: string;
  Pax: number;
  imagename: string; // Image filename or URL
  BGP: string;
} 

// Main Favourites page component
const FavouritesPage = async () => { 

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
    const userFavList:RoomDetails[] = await getUserFavList(userInfo[0].UserID);
    const allBookings = await getBookings();

 
    return (
        <div className="flex w-full h-screen overflow-hidden">
          <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="w-full max-h-screen"
        >
            <div  className="overflow-y-scroll no-scrollbar h-screen bg-neutral-800 flex-1 ml-auto mr-auto lg:w-[1100px] shadow-xl shadow-black-500/50 ">
              <Navbar />
              {userFavList.length > 0 ? (
                <FavouritesList rooms={userFavList} userId={userInfo[0].UserID} userRole={userInfo[0].Role} allBookings={allBookings} username={userInfo[0].Username}/>
              ) : (
                <p className="text-gray-400">No rooms found for this user.</p>
              )}
            </div>
        </Vortex>
      </div>
    );
  } catch (error) {
    // Handle any errors (e.g., JSON parsing issues)
    console.error('Error reading cookie:', error);
    redirect('/login-page'); // Redirect to the home page on erro
  }
};

export default FavouritesPage;

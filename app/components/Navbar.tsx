'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
const Navbar = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const router = useRouter();

  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSettings = () => {
    console.log('Settings clicked');
    router.push(`/settings?username=${username}`);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
    router.push('/'); // Redirect to home or login
  };

  return (
    
    <div className="flex-1 ml-auto mr-auto w-[1100px] bg-gradient-to-r bg-neutral-800 text-white shadow-xl shadow-black-500/50 ">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold text-white tracking-wide font-mono">Welcome back, {username}</div>
        <div className="relative">
          <Image
            src="/images/profile-icon.png" // Replace with actual image
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full cursor-pointer ring-2 ring-gray-700 transition duration-300 transform hover:scale-105 hover:ring-gray-500"
            onClick={handleProfileClick} // Toggle dropdown on click
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={handleSettings}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-white transition duration-300"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white transition duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        
      </div>      

      {/* Navigation Menu */}
      <nav className="font-sans bold flex-1 ml-auto mr-auto rounded-full w-[550px] bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-900 py-5 shadow-md text-xl">
        <ul className="flex justify-center space-x-8 max-w-7xl mx-auto">
          <li>
            <Link  className="text-gray-300 hover:text-white transition duration-300 ease-in-out hover:border-b-2 border-neutral-100" href={{ query: { username }, pathname: "/UserHomepage" }}>
                Home
            </Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white transition duration-300 ease-in-out hover:border-b-2 border-neutral-100" href={{ query: { username }, pathname: "/myBookings" }}>
                Bookings
            </Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white transition duration-300 ease-in-out hover:border-b-2 border-neutral-100" href={{ query: { username }, pathname: "/feedback" }}>
                Feedback
            </Link>
          </li>
          <li>
            <Link className="text-gray-300 hover:text-white transition duration-300 ease-in-out hover:border-b-2 border-neutral-100" href={{ query: { username }, pathname: "/FavouritesPage" }}>
                Favourites
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

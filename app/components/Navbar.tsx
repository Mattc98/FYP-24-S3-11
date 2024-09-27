'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

const Navbar = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const userID = searchParams.get('userID');
  const router = useRouter();
  
  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear tokens, reset user state, etc.)
    // For example, you might clear user data and redirect to a login page:
    console.log('User logged out');
    // Redirect to login page or home
    router.push('/'); // Change '/login' to your actual login route
  };

  return (
    <div className="w-full bg-gray-500 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-2xl font-bold">Welcome back, {username}</div>
        <div className="relative flex items-center">
          <Image
            src="/images/profile-icon.png" // Replace with actual image
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full cursor-pointer"
            onClick={handleProfileClick} // Toggle dropdown on click
          />
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-gray-700 rounded shadow-lg">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="bg-gray-600 py-2">
        <ul className="flex justify-center space-x-8">
          <li>
            <Link className="text-white hover:text-gray-300 transition duration-200" href="/UserHomepage">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300 transition duration-200" href="myBookings">
              Bookings
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300 transition duration-200" href="/feedback">
              Feedback
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300 transition duration-200" href="/favourites">
              Favourites
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

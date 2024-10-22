'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // Import usePathname to get the current route


const Navbar= () => {
  // State to manage dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const pathname = usePathname(); // Get the current path

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const deleteCookie = (cookieName: string) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    deleteCookie('username');
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex-1 ml-auto mr-auto  p-4 bg-neutral-800 text-white">
      {/* Hamburger icon for mobile */}
      <div className="sm:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="hidden sm:flex font-sans bold pt-9px flex-1 ml-auto mr-auto rounded-full w-[550px] bg-neutral-900 py-5 shadow-md text-xl">
        <ul className="flex justify-center space-x-8 max-w-7xl mx-auto">
          <li>
            <Link
              className={`${
                pathname === '/AdminHomepage' ? 'text-cyan-400' : 'text-gray-300'
              } transition duration-300 ease-in-out hover:text-cyan-400 hover`}
              href="/AdminHomepage"
            >
              Home
            </Link>
          </li>
          
          <li>
            <div className="relative w-[30px]">
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
                  <Link href="/settings">
                    <button className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-white transition duration-300">
                      Settings
                    </button>
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white transition duration-300">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {isMobileMenuOpen && (
        <nav className="sm:hidden bg-neutral-900 py-2 px-4 flex-1 mr-auto">
          <ul className="space-y-2">
            <li>
              <Link
                className={`block ${
                  pathname === '/UserHomepage' ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                } hover:text-white transition duration-300`}
                href="/UserHomepage"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={`block ${
                  pathname === '/myBookings' ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                } hover:text-white transition duration-300`}
                href="/myBookings"
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                className={`block ${
                  pathname === '/feedback' ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                } hover:text-white transition duration-300`}
                href="/feedback"
              >
                Feedback
              </Link>
            </li>
            <li>
              <Link
                className={`block ${
                  pathname === '/FavouritesPage' ? 'text-cyan-400 font-semibold' : 'text-gray-300'
                } hover:text-white transition duration-300`}
                href="/FavouritesPage"
              >
                Favourites
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-300 hover:text-white transition duration-300"
                href="/settings"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-300 hover:text-white transition duration-300"
                href="/"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

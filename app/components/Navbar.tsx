'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const deleteCookie = (cookieName:string) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    deleteCookie('username');
    deleteCookie('role');
    window.location.href = "/Login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (url: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = url;
  };
  

  return (
    <div className="flex-1 ml-auto mr-auto lg:w-[1100px] p-4 bg-neutral-800 text-white">
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

      <nav className="hidden sm:flex font-sans bold pt-9px flex-1 ml-auto mr-auto rounded-full w-[550px] bg-neutral-900 py-5 shadow-md text-xl">
        <ul className="flex justify-center space-x-8 max-w-7xl mx-auto">
          <li>
            <Link href="/UserHomepage" onClick={handleLinkClick('/UserHomepage')} className={`${pathname === '/UserHomepage' ? 'text-cyan-400' : 'text-gray-300'} transition duration-300 ease-in-out hover:text-cyan-400 hover`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/myBookings" onClick={handleLinkClick('/myBookings')} className={`${pathname === '/myBookings' ? 'text-cyan-400' : 'text-gray-300'} transition duration-300 ease-in-out hover:text-cyan-400 hover`}>
              Bookings
            </Link>
          </li>
          <li>
            <Link href="/feedback" onClick={handleLinkClick('/feedback')} className={`${pathname === '/feedback' ? 'text-cyan-400' : 'text-gray-300'} transition duration-300 ease-in-out hover:text-cyan-400 hover`}>
              Feedback
            </Link>
          </li>
          <li>
            <Link href="/FavouritesPage" onClick={handleLinkClick('/FavouritesPage')} className={`${pathname === '/FavouritesPage' ? 'text-cyan-400' : 'text-gray-300'} transition duration-300 ease-in-out hover:text-cyan-400 hover`}>
              Favourites
            </Link>
          </li>
          <li>
            <div className="relative w-[30px]">
              <Image
                src="/images/profile-icon.png"
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full cursor-pointer ring-2 ring-gray-700 transition duration-300 transform hover:scale-105 hover:ring-gray-500"
                onClick={handleProfileClick}
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
              <Link href="/UserHomepage" onClick={handleLinkClick('/UserHomepage')} className={`${pathname === '/UserHomepage' ? 'text-cyan-400 font-semibold' : 'text-gray-300'} hover:text-white transition duration-300`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/myBookings" onClick={handleLinkClick('/myBookings')} className={`${pathname === '/myBookings' ? 'text-cyan-400 font-semibold' : 'text-gray-300'} hover:text-white transition duration-300`}>
                Bookings
              </Link>
            </li>
            <li>
              <Link href="/feedback" onClick={handleLinkClick('/feedback')} className={`${pathname === '/feedback' ? 'text-cyan-400 font-semibold' : 'text-gray-300'} hover:text-white transition duration-300`}>
                Feedback
              </Link>
            </li>
            <li>
              <Link href="/FavouritesPage" onClick={handleLinkClick('/FavouritesPage')} className={`${pathname === '/FavouritesPage' ? 'text-cyan-400 font-semibold' : 'text-gray-300'} hover:text-white transition duration-300`}>
                Favourites
              </Link>
            </li>
            <li>
              <Link href="/settings" onClick={handleLinkClick('/settings')} className="block text-gray-300 hover:text-white transition duration-300">
                Settings
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-red-600 hover:text-white transition duration-300">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;

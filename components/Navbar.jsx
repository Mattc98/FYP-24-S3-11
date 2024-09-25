import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
        <li className='flex space-x-4'>
          <Link className='text-white hover:text-gray-400' href='/UserHomepage'>Home</Link>
          <Link className='text-white hover:text-gray-400' href='/about'>Bookings</Link>
          <Link className='text-white hover:text-gray-400' href='/UserHomepage'>Feedback</Link>
          <Link className='text-white hover:text-gray-400' href='/about'>Favourites</Link>
        </li>
    </nav>
  )
}

export default Navbar

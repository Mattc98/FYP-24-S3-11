import React from 'react'
import Navbar from '../components/Navbar'
import Bookings from '../components/myBookings/myBookingsPage'


const myBookings = async () => {
    
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <Bookings />
            </div>
        </div>
    )
}

export default myBookings

// /app/api/createBooking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createBookingInDB } from '@/aws_db/bookings'; // Adjust based on your setup

// Named export for the POST method
export async function POST(req: NextRequest) {
    try {
        const { RoomID, UserID, BookingDate, BookingTime, RoomPin } = await req.json();

        if (!RoomID || !UserID || !BookingDate || !BookingTime || !RoomPin) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Call your function to create the booking in the database
        await createBookingInDB(RoomID, UserID, BookingDate, BookingTime, RoomPin);

        return NextResponse.json({ message: 'Booking created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

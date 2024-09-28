import { calluser } from '@/aws_db/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { bookingId, newDate, newTime } = await request.json();
    // Update the booking in the database
    const result = await calluser(`
        UPDATE Booking
        SET BookingDate = '${newDate}', BookingTime = '${newTime}'
        WHERE BookingID = ${bookingId}
    `);
    return NextResponse.json({ success: true, result });

}

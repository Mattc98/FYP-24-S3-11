import { calluser } from '@/aws_db/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { bookingId } = await request.json();
    // Delete the booking from the database
    const result = await calluser(`DELETE FROM Booking WHERE BookingID = ${bookingId}`);
    return NextResponse.json({ success: true, result });
}

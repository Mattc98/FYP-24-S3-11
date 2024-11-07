import { Booking } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { bookingId } = await request.json();
    // Delete the booking from the database
    const deletedRoom = await db.delete(Booking).where(eq(Booking.BookingID, bookingId));
    return NextResponse.json({ success: true, deletedRoom });
}

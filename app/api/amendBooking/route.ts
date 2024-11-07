import { Booking } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { bookingId, sgNewDate, new24Time } = await request.json();
    // Update the booking in the database
    const newBooking = db.update(Booking).set({
        BookingDate: sgNewDate,
        BookingTime: new24Time
    }).where(eq(Booking.BookingID, bookingId)).execute();
    return NextResponse.json({ success: true, newBooking });
}

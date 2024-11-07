import { Booking } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// Define a type for the expected result structure
export async function POST(request: Request) {
    try {
        const { bookingID, sgNewDate, new24Time, newUserId } = await request.json();
        
        const newBooking = db.update(Booking).set({
            BookingDate: sgNewDate,
            BookingTime: new24Time,
            UserID: newUserId
        }).where(eq(Booking.BookingID, bookingID));

        return NextResponse.json({ success: true, message: 'Booking successfully overridden', newBooking });
    } catch (error) {
        console.error('Error overriding booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to override booking' });
    }
}

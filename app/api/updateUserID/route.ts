// app/api/updateUserID/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { Booking } from '@/aws_db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { bookingId, newUserId } = await request.json();

        // Validate input
        if (!bookingId || !newUserId) {
            return NextResponse.json({ success: false, error: 'Booking ID and new User ID are required' });
        }

        await db.update(Booking).set({BookingID: bookingId}).where(eq(Booking.BookingID, newUserId))

        return NextResponse.json({ success: true, message: 'UserID updated successfully'});
    } catch (error) {
        console.error('Error updating UserID:', error);
        return NextResponse.json({ success: false, error: 'Failed to update UserID' });
    }
}

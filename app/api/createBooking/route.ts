import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { Booking } from '@/aws_db/schema';

// Named export for the POST method
export async function POST(req: NextRequest) {
    try {
        const { RoomID, UserID, BookingDate, BookingTime, RoomPin, BGP } = await req.json();

        if (!RoomID || !UserID || !BookingDate || !BookingTime || !RoomPin || !BGP) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.insert(Booking).values({
            RoomID: RoomID,
            UserID: UserID,
            BookingDate: BookingDate,
            BookingTime: BookingTime,
            RoomPin: RoomPin,
            BGP: BGP,
        })

        return NextResponse.json({ message: 'Booking created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

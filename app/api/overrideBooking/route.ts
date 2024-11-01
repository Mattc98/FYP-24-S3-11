import { calluser } from '@/aws_db/db';
import { NextResponse } from 'next/server';

// Define a type for the expected result structure
interface UpdateResult {
    affectedRows: number;
    // Add any other expected properties from calluser's result
}

export async function POST(request: Request) {
    try {
        const { bookingId, sgNewDate, new24Time, newUserId } = await request.json();

        // Update the booking in the database with plain query
        const result = await calluser(`
            UPDATE Booking
            SET BookingDate = '${sgNewDate}', BookingTime = '${new24Time}', UserID = '${newUserId}'
            WHERE BookingID = ${bookingId}
        `) as UpdateResult; // Assert the type of result

        // Check if any row was actually updated
        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, error: 'No booking found or no changes made' });
        }

        return NextResponse.json({ success: true, message: 'Booking successfully overridden', result });
    } catch (error) {
        console.error('Error overriding booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to override booking' });
    }
}

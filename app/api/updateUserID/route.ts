// app/api/updateUserID/route.ts
import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

// Define the expected structure for the result
interface UpdateResult {
    affectedRows: number;
}

export async function POST(request: Request) {
    try {
        const { bookingId, newUserId } = await request.json();

        // Validate input
        if (!bookingId || !newUserId) {
            return NextResponse.json({ success: false, error: 'Booking ID and new User ID are required' });
        }

        // Update the UserID for the specified booking
        const result = await calluser(`
            UPDATE Booking
            SET UserID = '${newUserId}'
            WHERE BookingID = ${bookingId}
        `) as UpdateResult; // Type assertion here

        // Check if the update was successful
        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, error: 'No booking found with the specified ID or no changes made' });
        }

        return NextResponse.json({ success: true, message: 'UserID updated successfully' });
    } catch (error) {
        console.error('Error updating UserID:', error);
        return NextResponse.json({ success: false, error: 'Failed to update UserID' });
    }
}

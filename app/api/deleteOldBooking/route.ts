// app/api/deleteOldBooking/route.ts
import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

interface DeleteResult {
    affectedRows: number;
}

export async function DELETE(request: Request) {
    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ success: false, error: 'Booking ID is required' });
        }

        // Execute the delete query in the database
        const result = await calluser(`
            DELETE FROM Booking
            WHERE BookingID = ${bookingId}
        `) as DeleteResult; // Type assertion to DeleteResult

        // Check if the booking was successfully deleted
        if (result.affectedRows === 0) {
            return NextResponse.json({ success: false, error: 'No booking found with the specified ID' });
        }

        return NextResponse.json({ success: true, message: 'Old booking deleted successfully' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete booking' });
    }
}

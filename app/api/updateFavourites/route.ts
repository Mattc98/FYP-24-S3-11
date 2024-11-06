import { type NextRequest, NextResponse } from 'next/server';
import { createFavInDB } from '@/aws_db/favourite'; // Adjust based on your setup
import { calluser } from '@/aws_db/db';


// Named export for the POST method
export async function POST(req: NextRequest) {
    try {
        const { UserID, RoomID } = await req.json();

        if (!UserID || !RoomID ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Call your function to create the booking in the database
        await createFavInDB(UserID, RoomID);

        return NextResponse.json({ message: 'Marked as favourite' }, { status: 200 });
    } catch (error) {
        console.error('Error marking as favourite:', error);
        return NextResponse.json({ error: 'Failed to mark as favourite' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const { UserID, RoomID } = await req.json();

        if (!UserID || !RoomID ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Call your function to create the booking in the database
        const result = await calluser(`DELETE FROM Favourite WHERE UserID = ${UserID} AND RoomID = ${RoomID}`);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error marking as favourite:', error);
        return NextResponse.json({ error: 'Failed to mark as favourite' }, { status: 500 });
    }
}


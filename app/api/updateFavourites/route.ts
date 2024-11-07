import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { Favourite } from '@/aws_db/schema';
import { eq } from 'drizzle-orm';


// Named export for the POST method
export async function POST(req: NextRequest) {
    try {
        const { UserID, RoomID } = await req.json();

        if (!UserID || !RoomID ) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.insert(Favourite).values({
            UserID: UserID,
            RoomID: RoomID,
        })

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

        const deletedRoom = await db.delete(Favourite).where(eq(Favourite.UserID, UserID) && eq(Favourite.RoomID, RoomID));

        return NextResponse.json({ success: true, deletedRoom });
    } catch (error) {
        console.error('Error marking as favourite:', error);
        return NextResponse.json({ error: 'Failed to mark as favourite' }, { status: 500 });
    }
}


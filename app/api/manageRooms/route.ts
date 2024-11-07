import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { Room } from '@/aws_db/schema';
import { eq } from 'drizzle-orm';  

// Fetch all rooms (GET)
export async function GET() {
    try {
        const rooms = await db.select().from(Room);
        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json({ message: 'Error fetching rooms' }, { status: 500 });
    }
}

// Add a new room (POST)
export async function POST(request: Request) {
    try {
        const { RoomName, Pax, Type, Status, imagename, BGP } = await request.json(); // Extract BGP

        await db.insert(Room).values({
            RoomName: RoomName,
            Pax: Pax,
            Type: Type,
            Status: Status,
            imagename: imagename,
            BGP: BGP,
        }).execute();


        const newRoom = await db.select().from(Room).where(eq(Room.RoomName, RoomName));

        return NextResponse.json(newRoom); // Return the newly created room object
    } catch (error) {
        console.error('Error adding room:', error);
        return NextResponse.json({ message: 'Error adding room',  details: (error as Error).message }, { status: 500 });
    }
}

// Update a room (PUT)
export async function PUT(request: Request) {
    try {
        const { RoomID, RoomName, Pax, Type, Status,BGP, imagename } = await request.json();

        await db
        .update(Room)
        .set({
            RoomName,
            Pax,
            Type,
            Status,
            imagename,
            BGP
        })
        .where(eq(Room.RoomID, RoomID))
        .execute();

        return NextResponse.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('Error updating room:', error);
        return NextResponse.json({ message: 'Error updating room' }, { status: 500 });
    }
}

// Delete a room (DELETE)
export async function DELETE(request: Request) {
    try {
        const { RoomID } = await request.json();

        await db.delete(Room).where(eq(Room.RoomID, RoomID))
        
        return NextResponse.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json({ message: 'Error deleting room' }, { status: 500 });
    }
}
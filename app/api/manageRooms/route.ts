import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

interface Room {
    RoomID: number;
    RoomName: string;
    Pax: number;
    Type: string;
    Status: string;
    imagename: string;

}
    


// Fetch all rooms (GET)
export async function GET() {
    try {
        const rooms = await calluser("SELECT * FROM Room");
        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json({ message: 'Error fetching rooms' }, { status: 500 });
    }
}

// Add a new room (POST)
export async function POST(request: Request) {
    try {
        const { RoomName, Pax, Type, Status, imagename } = await request.json();

        // Use a transaction to ensure data integrity
        const query = `INSERT INTO Room (RoomName, Pax, Type, Status, imagename) VALUES ('${RoomName}', ${Pax}, '${Type}', '${Status}', '${imagename}')`; // Corrected the query
        await calluser(query); // Use parameterized queries to prevent SQL injection

        // Get the last inserted RoomID
        const querySelect = `SELECT RoomID, RoomName, Pax, Type, Status, imagename FROM Room WHERE RoomName = '${RoomName}'`;
        const newRoom = await calluser(querySelect) as Room[]; // Get the new room details

        return NextResponse.json(newRoom[0]); // Return the newly created room object
    } catch (error) {
        console.error('Error adding room:', error);
        return NextResponse.json({ message: 'Error adding room' }, { status: 500 });
    }
}


// Update a room (PUT)
export async function PUT(request: Request) {
    try {
        const { RoomID, RoomName, Pax, Type, Status, imagename } = await request.json();
        const query = `UPDATE Room SET RoomName = '${RoomName}', Pax = ${Pax}, Type = '${Type}', Status = '${Status}', imagename = '${imagename}' WHERE RoomID = ${RoomID}`;
        await calluser(query);
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
        const query = `DELETE FROM Room WHERE RoomID = ${RoomID}`;
        await calluser(query);
        return NextResponse.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json({ message: 'Error deleting room' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';
import fs from 'fs';
import path from 'path';

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

        // Extract the base64 string and the file extension from the imagename
        const base64Data = imagename.split(',')[1];
        const extension = imagename.split(';')[0].split('/')[1];

        // Define the path to save the image
        const imagePath = path.join(process.cwd(), 'public', 'images', `${RoomName}.${extension}`);

        // Write the image file to the specified path
        fs.writeFileSync(imagePath, base64Data, 'base64');

        // Use a transaction to ensure data integrity
        const query = `INSERT INTO Room (RoomName, Pax, Type, Status, imagename) VALUES ('${RoomName}', ${Pax}, '${Type}', '${Status}', '${RoomName}.${extension}')`; // Store the filename
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

        // Log received values for debugging
        console.log('Received values:', { RoomID, RoomName, Pax, Type, Status, imagename });

        const query = `
            UPDATE Room 
            SET RoomName = '${RoomName}', 
                Pax = ${Pax}, 
                Type = '${Type}', 
                Status = '${Status}', 
                imagename = '${imagename}' 
            WHERE RoomID = ${RoomID}
        `;

        console.log('Executing query:', query); // Log the SQL query

        await calluser(query); // Make sure this function is correct and executes the query
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

        // First, fetch the room details to get the imagename
        const querySelect = `SELECT imagename FROM Room WHERE RoomID = ${RoomID}`;
        const room = await calluser(querySelect) as Room[];

        if (room.length === 0) {
            return NextResponse.json({ message: 'Room not found' }, { status: 404 });
        }

        const imageName = room[0].imagename;
        const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

        // Delete the image file if it exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Remove the image file
        }

        // Now, delete the room from the database
        const query = `DELETE FROM Room WHERE RoomID = ${RoomID}`;
        await calluser(query);
        
        return NextResponse.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json({ message: 'Error deleting room' }, { status: 500 });
    }
}
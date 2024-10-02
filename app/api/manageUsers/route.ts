import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

// Define the UserAccount interface
interface userAccount {
    UserID: number;
    Username: string;
    Role: string;
    ProfilePicture: string;
  }

// Handle the API request
export async function GET() {
    try {
        const users = await calluser('SELECT UserID, Username, Role FROM userAccount');
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// Handle the PUT request (Change Role and Username)
export async function PUT(req: Request) {
    const { id, newUsername, newRole } = await req.json();

    try {
        // Create the SQL query string with placeholders
        const query = `UPDATE userAccount SET Username = '${newUsername}', Role = '${newRole}' WHERE UserID = ${id}`;
        
        // Call the existing function with only the query string
        await calluser(query);
        
        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// Handle the POST request (Add a new user)
export async function POST(req: Request) {
    const { Username, Password, Role, ProfilePicture } = await req.json();

    try {
        // Manually create the SQL query string
        const query = `
          INSERT INTO userAccount (Username, Password, Role) 
          VALUES ('${Username}', '${Password}', '${Role}')
        `;
        
        // Call the existing calluser function with the query
        await calluser(query);

        // Fetch the newly added user to return it (assuming the user is added successfully)
        const getUserQuery = `SELECT UserID, Username, Role FROM userAccount WHERE Username = '${Username}' AND Password = '${Password}' AND Role= '${Role}'`;
        const newUser = await calluser(getUserQuery) as userAccount[];

        return NextResponse.json(newUser[0]); // Return the newly created user
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }
}

// Handle the DELETE request (Terminate a user)
export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        // Create the SQL query string to delete the user
        const query = `DELETE FROM userAccount WHERE UserID = ${id}`;
        
        // Call the existing function with the query
        await calluser(query);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

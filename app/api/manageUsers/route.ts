import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db'; 

interface UserAccount {
    UserID: number;
    Username: string;
    Role: string;
    Email: string;
}

interface MaxIDResult {
    maxID: number | null;
}

export async function GET() {
    try {
        const users = await calluser('SELECT UserID, Username, Role, Email FROM userAccount');
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, newUsername, newRole } = await req.json();

    try {
        // Create the SQL query string with placeholders
        const query = `UPDATE userAccount SET Username = '${newUsername}', Role = '${newRole}' WHERE UserID = ${id}`;
        
        // Call the existing function with only the query string
        await calluser(query);
        
        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { Username, Password, Email, Role } = await req.json();

    try {
        // Check if Username or Email already exists
        const checkDuplicateQuery = `
            SELECT * FROM userAccount 
            WHERE Username = '${Username}' OR Email = '${Email}'
        `;
        const duplicateResult = await calluser(checkDuplicateQuery) as UserAccount[];

        if (duplicateResult.length > 0) {
            return NextResponse.json({ error: 'Username or Email already exists' }, { status: 400 });
            
        }

        // Get the highest existing UserID for the given role
        const getMaxUserIDQuery = `SELECT MAX(UserID) as maxID FROM userAccount WHERE Role = '${Role}'`;
        const result = await calluser(getMaxUserIDQuery) as { maxID: number | null }[];

        // Declare nextUserID outside of if/else block for scope visibility
        let nextUserID: number;

        if (!result || result.length === 0 || result[0].maxID === null) {
            // If no UserID exists for the role, start from 1
            nextUserID = 1;
        } else {
            // Get the next UserID based on the maximum found
            nextUserID = result[0].maxID + 1;
        }

        // Insert the new user with the calculated UserID
        const insertQuery = `
            INSERT INTO userAccount (UserID, Username, Password, Email, Role) 
            VALUES (${nextUserID}, '${Username}', '${Password}', '${Email}', '${Role}')
        `;
        await calluser(insertQuery);

        const newUser: UserAccount = { UserID: nextUserID, Username, Role, Email };
        return NextResponse.json(newUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const query = `DELETE FROM userAccount WHERE UserID = ${id}`;
        await calluser(query);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
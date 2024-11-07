import { userAccount } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

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
        const users = await db.select({
            UserID : userAccount.UserID,
            Username : userAccount.Username,
            Email : userAccount.Email,
            Role: userAccount.Role,
        }).from(userAccount);
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { id, newUsername, newRole } = await req.json();

    try {
        await db.update(userAccount).set({
            Username: newUsername, 
            Role: newRole,
        }).where(eq(userAccount.UserID, id))
        
        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { Username, Password, Email, Role} = await req.json();

    try {
        const duplicateResult = await db.select().from(userAccount)
        .where(eq(userAccount.Username, Username) || eq(userAccount.Email, Email)) as UserAccount[];

        if (duplicateResult.length > 0) {
            return NextResponse.json({ error: 'Username or Email already exists' }, { status: 400 });
            
        }

        const result = await db.select({
            maxID: sql`MAX(${userAccount.UserID})`.as('maxID') // Use raw SQL to select MAX(UserID)
        })
        .from(userAccount)
        .where(eq(userAccount.Role, Role)) as MaxIDResult[];
        
        if (!result || result.length === 0) {
            throw new Error('Failed to retrieve max UserID');
        }

        const maxID = result[0].maxID;
        const nextUserID = (maxID ?? 0) + 1;  // If maxID is null, start from 1

        await db.insert(userAccount).values({
            UserID: nextUserID,
            Username: Username,
            Password: Password,
            Email: Email,
            Role: Role
        }).execute();

        const newUser: UserAccount = { UserID: nextUserID, Username, Role, Email};
        return NextResponse.json(newUser);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        await db.delete(userAccount).where(eq(userAccount.UserID, id));
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
    try {
        const { UserID } = await req.json();

        if (!UserID) {
            return NextResponse.json({ error: 'Missing UserID' }, { status: 400 });
        }

        const userInfo = await db
            .select({
                UserID: userAccount.UserID,
                Username: userAccount.Username,
                Email: userAccount.Email,
                Role: userAccount.Role,
            })
            .from(userAccount)
            .where(eq(userAccount.UserID, UserID));

        if (!userInfo.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(userInfo[0]); // Return the user info
    } catch (error) {
        console.error('Error fetching user email:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

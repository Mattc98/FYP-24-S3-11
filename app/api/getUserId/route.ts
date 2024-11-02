import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies API
import { calluser } from '@/aws_db/db';

interface UserResult {
    UserID: string;
}

export async function GET() {
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value;

    if (!username) {
        return NextResponse.json({ success: false, error: 'Username not found in cookies' });
    }

    try {
        // Query the database for the user's ID based on the username from cookies
        const result = await calluser(`SELECT UserID FROM userAccount WHERE Username = '${username}'`) as UserResult[];

        if (result.length === 0) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        const { UserID: userId } = result[0];

        return NextResponse.json({ success: true, userId });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch user data' });
    }
}

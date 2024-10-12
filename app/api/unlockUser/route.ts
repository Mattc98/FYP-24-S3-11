import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

export async function PUT(req: Request) {
    try {
        const { UserID, FailLogin, IsLocked } = await req.json();

        const query=`Update userAccount Set FailLogin =${FailLogin}, IsLocked = ${IsLocked} WHERE UserID = ${UserID}`;

        await calluser(query);

        return NextResponse.json({ message: 'User unlocked successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to unlock user' }, { status: 500 });
    }
    
}
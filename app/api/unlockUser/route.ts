import { NextResponse } from 'next/server';
import { userAccount } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';

export async function PUT(req: Request) {
    try {
        const { UserID, FailLogin, IsLocked } = await req.json();

        await db.update(userAccount).set({
            FailLogin: FailLogin,
            IsLocked: IsLocked,
        }).where(eq(userAccount.UserID, UserID)).execute();

        return NextResponse.json({ message: 'User unlocked successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to unlock user' }, { status: 500 });
    }
    
}
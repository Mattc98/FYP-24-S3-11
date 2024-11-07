import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';

export async function POST(request: Request) {
  try {
    const { UserID, FailLogin, IsLocked } = await request.json();
    
    await db
        .update(userAccount)
        .set({ 
            FailLogin: FailLogin, 
            IsLocked: IsLocked,
        })
        .where(eq(userAccount.UserID, UserID))
        .execute();
    
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';

interface DatabaseUser {
  Password: string;
}

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Username, current password, and new password are required' }, { status: 400 });
    }

    const result = await db
        .select({ Password: userAccount.Password })
        .from(userAccount)
        .where(eq(userAccount.Username, username))
        .execute();
    
    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result[0] as DatabaseUser;

    if (typeof user.Password !== 'string') {
      throw new Error('Invalid database response');
    }

    if (user.Password !== currentPassword) {
      return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
    }

    await db
        .update(userAccount)
        .set({ Password: newPassword })
        .where(eq(userAccount.Username, username))
        .execute();
    
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
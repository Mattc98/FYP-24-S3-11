import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';

export async function POST(request: Request) {
  try {
    const { username, currentPassword } = await request.json();

    if (!username || !currentPassword) {
      return NextResponse.json({ message: 'Username and current password are required' }, { status: 400 });
    }

    const result = await db.select({
      Password: userAccount.Password
    }).from(userAccount).where(eq(userAccount.Username, username));
    
    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const user = result[0];

    if (typeof user.Password !== 'string') {
      throw new Error('Invalid database response');
    }

    if (user.Password === currentPassword) {
      return NextResponse.json({ message: 'Password verified successfully' }, { status: 200 });
    }
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
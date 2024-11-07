import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/drizzle';
import { userAccount } from '@/aws_db/schema';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
  
    if (!userId) {
      return NextResponse.json({ error: 'UserID is required' }, { status: 400 });
    }
  
    try {
      // Query to get the user email
      const query = await db.select({
        Email: userAccount.Email,
      })
      .from(userAccount)
      .where(eq(userAccount.UserID, Number(userId)));

      const result = query as Array<{ Email: string }>;

      if (result.length > 0) {
        return NextResponse.json({ email: result[0].Email }, { status: 200 });
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    } catch (error) {
      console.error('Error fetching user email:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
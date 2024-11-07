import { NextResponse } from 'next/server';
import { db } from '@/lib/drizzle';
import { Review } from '@/aws_db/schema';

export async function POST(request: Request) {
  try {
    const { RoomID, UserID, Feedback } = await request.json();

    await db.insert(Review).values({
      RoomID: RoomID,
      UserID: UserID,
      Feedback: Feedback,
    });

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit feedback' }, { status: 500 });
  }
}
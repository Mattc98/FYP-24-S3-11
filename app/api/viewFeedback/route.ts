import { Review } from '@/aws_db/schema';
import { db } from '@/lib/drizzle';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ message: 'Room ID is required' }, { status: 400 });
    }

    try {
        const feedbackData = await db
        .select({
            Feedback: Review.Feedback,
            UserID: Review.UserID
        })
        .from(Review)
        .where(eq(Review.RoomID, Number(roomId)))
        .execute();
        
        return NextResponse.json(feedbackData, { status: 200 });
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        return NextResponse.json({ message: 'Failed to fetch feedback' }, { status: 500 });
      }
}

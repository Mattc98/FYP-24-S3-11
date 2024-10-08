import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db'; // Adjust the import path as necessary

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ message: 'Room ID is required' }, { status: 400 });
    }

    try {
        const query = `
          SELECT Feedback, UserID FROM Review WHERE RoomID = ${roomId}
        `;
        const feedbackData = await calluser(query);
        
        if (feedbackData instanceof Error) {
          throw feedbackData;
        }
    
        return NextResponse.json(feedbackData, { status: 200 });
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        return NextResponse.json({ message: 'Failed to fetch feedback' }, { status: 500 });
      }
}

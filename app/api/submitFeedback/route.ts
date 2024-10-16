import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

export async function POST(request: Request) {
  try {
    const { RoomID, UserID, Feedback } = await request.json();

    // IMPORTANT: This query is vulnerable to SQL injection.
    // Replace with a parameterized query as soon as possible.
    const query = `
      INSERT INTO Review (RoomID, UserID, Feedback)
      VALUES (${RoomID}, ${UserID}, '${Feedback}')
    `;
    
    const result = await calluser(query);
    
    if (result instanceof Error) {
      throw result;
    }
    
    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return NextResponse.json({ success: false, message: 'Failed to submit feedback' }, { status: 500 });
  }
}
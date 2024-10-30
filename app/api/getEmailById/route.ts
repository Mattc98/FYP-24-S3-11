// app/api/getUserEmailById/route.ts
import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';
import mysql from 'mysql2';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
  
    if (!userId) {
      return NextResponse.json({ error: 'UserID is required' }, { status: 400 });
    }
  
    try {
      // Query to get the user email
      const query = `SELECT Email FROM userAccount WHERE UserID = ${mysql.escape(userId)}`;
      const result = (await calluser(query)) as Array<{ Email: string }>;
  
      if (result.length > 0) {
        return NextResponse.json({ email: result[0].Email }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
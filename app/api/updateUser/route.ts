import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db';

export async function POST(request: Request) {
  try {
    const { UserID, FailLogin, IsLocked } = await request.json();
    
    // Update the user in the database
    await calluser(`UPDATE userAccount SET FailLogin = ${FailLogin}, IsLocked = ${IsLocked ? 1 : 0} WHERE UserID = ${UserID}`);
    
    return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
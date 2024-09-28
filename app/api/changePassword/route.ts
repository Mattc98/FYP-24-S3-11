import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db'; // Adjust this import based on your project structure

export async function POST(request: Request) {
  try {
    const { username, newPassword } = await request.json();

    if (!username || !newPassword) {
      return NextResponse.json({ message: 'Username and new password are required' }, { status: 400 });
    }

    // Here you would typically hash the password before storing it
    // For demonstration, we're storing it as plain text (NOT recommended for production)
    await calluser(`UPDATE userAccount SET Password = '${newPassword}' WHERE Username = '${username}'`);
    
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
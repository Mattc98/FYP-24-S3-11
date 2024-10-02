import { NextResponse } from 'next/server';
import { calluser } from '@/aws_db/db'; // Adjust this import based on your project structure

interface DatabaseUser {
  Password: string;
}

export async function POST(request: Request) {
  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Username, current password, and new password are required' }, { status: 400 });
    }

    const result = await calluser(`SELECT Password FROM userAccount WHERE Username = '${username}'`);
    
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

    // Update password
    // In a real application, you would hash the new password before storing it
    await calluser(`UPDATE userAccount SET Password = '${newPassword}' WHERE Username = '${username}'`);
    
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
// app/api/getName/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const username = cookieStore.get('username')?.value;
    return NextResponse.json({ username });
}

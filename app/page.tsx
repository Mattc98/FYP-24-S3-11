// app/page.tsx
import { calluser } from '@/aws_db/db';

async function fetchuser() {
  try {
    const response = await calluser("SELECT * FROM user", []);
    return JSON.stringify(response);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}

export default async function Home() {
  const userData = await fetchuser();
  
  return (
    <div>
      <h1>This is the home page</h1>
      <p>User data: {userData}</p>
    </div>
  );
}
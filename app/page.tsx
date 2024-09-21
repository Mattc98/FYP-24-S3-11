import { calluser } from '@/aws_db/db';

interface user{
  userid: number;
  username: string;
  password: string;
}

async function fetchuser() {
  try {
    const response = await calluser("SELECT * FROM user");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}

export default async function Home() {
  const users:user[] = await fetchuser();

  return (
    <div>
      <h1>This is the home page</h1>
      <p>Userid: {users[0].userid}</p>
      <p>Username: {users[0].username}</p>
      <p>password: {users[0].password}</p>
    </div>
  );
}

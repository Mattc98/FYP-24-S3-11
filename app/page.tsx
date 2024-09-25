import { calluser } from '@/aws_db/db';

interface user{
  UserID: number;
  Username: string;
  Password: string;
  Email: string;
  Role: string;
  BiometricPassword: string;
  Status: string;
}

async function fetchuser() {
  try {
    const response = await calluser("SELECT * FROM userAccount");
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
      <p>Userid: {users[0].UserID}</p>
      <p>Username: {users[0].Username}</p>
      <p>password: {users[0].Password}</p>
    </div>
  );
}

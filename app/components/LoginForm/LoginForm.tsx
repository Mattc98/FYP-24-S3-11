import { calluser } from '@/aws_db/db';
import LoginFormClient from './LoginFormClient';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director";
  FailLogin: number;
  IsLocked: boolean;
}

async function fetchuser(): Promise<UserAccount[]> {
  try {
    const response = await calluser("SELECT * FROM userAccount");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}

const LoginForm = async () => {
  const userAccounts = await fetchuser(); // Fetching user data on the server

  return (
    <div>
      <LoginFormClient userAccount={userAccounts} />
    </div>
  );
};

export default LoginForm;
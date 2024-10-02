import { calluser } from '@/aws_db/db';
import LoginFormClient from './LoginFormClient';



interface userAccount{
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director";
}

async function fetchuser(): Promise<userAccount[]> {
  try {
    const response = await calluser("SELECT * FROM userAccount");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}


const LoginForm = async () => {
  const userAccounts= await fetchuser(); // Fetching user data on the server

  return (
    <div>
      <LoginFormClient userAccount={userAccounts} /> {/*--This is for USER and DIRECTOR'S ONLY*/}
    </div>
  );
};

export default LoginForm;
import LoginForm from "./components/LoginForm/LoginFormClient";
import Image from 'next/image';
import { calluser } from '@/aws_db/db';

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

export default async function Home() {
  const userAccounts = await fetchuser();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white">
      
      <div className="relative flex flex-col items-center w-full">
          <div className="mb-8">
            <Image
              src="/images/transparent_image.png" // Replace with your actual image path
              alt="Company Logo"
              width={600}
              height={600}
              className="object-contain h-100 w-100" // Logo styled to fit nicely
            />
          </div>
          <h2 className="text-4xl font-bold text-white text-center mb-6">Sign In</h2>
          <LoginForm userAccount={userAccounts}/>
      </div>
    </main>
  );
}

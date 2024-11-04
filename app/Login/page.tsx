import LoginForm from "../components/LoginForm/LoginFormClient";
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
  const userAccounts: UserAccount[] = await fetchuser();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800">
      <main className="flex-grow text-white flex flex-col justify-between">
        <div className="font-bold text-3xl px-14 pt-14">
          <a href="/">AuthBook</a>
        </div>
        <div className="relative flex flex-grow lg:flex-row flex-col justify-center items-center">
          <div className="flex justify-center items-center h-full">
            <Image
              src="/images/transparent_image.png" // Replace with your actual image path
              alt="Company Logo"
              width={700}
              height={700}
              className="object-contain max-h-full max-w-full" // Logo styled to fit nicely
            />
          </div>
          <LoginForm userAccount={userAccounts}/>
        </div>
      </main>
      <footer className="pb-8 text-center text-sm text-gray-500">
        © 2024 AuthBook. All rights reserved.
      </footer>
    </div>

  );
}

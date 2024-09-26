import { calluser } from '@/aws_db/db';
import LoginForm from "./components/LoginForm/LoginForm";
import styles from './Home.module.css';
import Image from 'next/image';


interface userAccount{
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
  const userAccount:userAccount[] = await fetchuser();

  return (
    
    <main className={styles.main}>
    <div>
      <div className="fixed top-52 left-52">
        <Image className="object-cover" src="/images/logo.png" alt="Company Logo" width={500} height={500}/>
      </div>
    
      <div className="fixed top-80 right-20 bg-white p-6 rounded-lg w-full max-w-md">
        
        <h1 className="text-5xl font-bold mb-10 text-center text-black fon">User Login</h1>
      
        <LoginForm />
      </div>
  </div>
  </main>
  );
}

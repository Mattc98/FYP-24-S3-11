import { calluser } from '@/aws_db/db';
import LoginForm from "./components/LoginForm/LoginForm";
import styles from './Home.module.css';

interface userAccount{
  UserId: number;
  Username: string;
  Password: string;
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
      <div className='text-black'>
        <h1>This is the home page</h1>
        <p>Userid: {userAccount[0].UserId}</p>
        <p>Username: {userAccount[0].Username}</p>
        <p>password: {userAccount[0].Password}</p>
    </div>
   <div className="fixed top-52 left-52">
      <img className="object-cover h-[500px] w-[500px]" src="/images/logo.png" alt="Company Logo"  />
    </div>
    
    <div className="fixed top-80 right-20 bg-white p-6 rounded-lg w-full max-w-md">
      
      <h1 className="text-5xl font-bold mb-10 text-center text-black fon">User Login</h1>
    
      <LoginForm />
    </div>
  </div>
  </main>
  );
}

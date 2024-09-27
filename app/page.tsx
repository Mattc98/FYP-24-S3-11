import LoginForm from "./components/LoginForm/LoginForm";
import styles from './Home.module.css';
import Image from 'next/image';

export default async function Home() {
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

import LoginForm from "./components/LoginForm/LoginForm";
import styles from './Home.module.css';
import Image from 'next/image';


export default async function Home() {
  

  return (
    <main className={styles.main}>
    <div>
      <div className='text-black'>
        <h1>This is the home page</h1>
        <p>Userid: {userAccount[0].UserID}</p>
        <p>Username: {userAccount[0].Username}</p>
        <p>password: {userAccount[0].Password}</p>
    </div>
   <div className="fixed top-52 left-52">
      <Image
            src="/images/logo.png" // Replace with actual image
            alt="Company Logo"
            width={1000}
            height={1000}
            className="object-cover h-[500px] w-[500px]"
          />
    </div>
    
    <div className="fixed top-80 right-20 bg-white p-6 rounded-lg w-full max-w-md">
      
      
        <div className="fixed top-52 left-52">
        <Image
            src="/images/logo.png" // Replace with actual image
            alt="Company Logo"
            width={1000}
            height={1000}
            className="object-cover h-[500px] w-[500px]"
          />
        </div>
    
        <div className="fixed top-80 right-20 bg-white p-6 rounded-lg w-full max-w-md">
          
          <LoginForm />
        </div>

      </div>
    </main>
  );
}

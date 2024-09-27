'use client'; // This is a client-side component for handling state and form interactions.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string; // Store hashed passwords instead for security
  Role: "User" | "Admin" | "Director"; // Make the roles to be more specific
}

interface ClientLoginFormProps {
  userAccount: UserAccount[]; // Accepting userAccount as a prop
}

const LoginFormClient: React.FC<ClientLoginFormProps> = ({ userAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<"User" | "Admin" | "Director"> ('User'); //Defaults to User
  const [headerText, setHeaderText] = useState('User Login');
  const router = useRouter();

  const lowercaseUsername = username.toLowerCase(); //Converting the input username to lowercase

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = userAccount.find(user => user.Username.toLowerCase() === lowercaseUsername);
    if (user && user.Password === password) {

      setMessage('Login Successful');
      router.push(`/UserHomepage?username=${encodeURIComponent(username)}&userId=${user.UserID}`);

    } else {
      setMessage('Invalid username or password');
    }
  };

  const handleRoleChange = (newRole : "User" | "Admin") => {
    setRole(newRole);
    setHeaderText(newRole === "Admin" ? "Admin Login" : "User Login")
  };

  return (
    <div>

      <h1 className="text-5xl font-bold mb-10 text-center text-black fon">{headerText}</h1>
        <button className={styles.switchButton1} onClick={() => handleRoleChange("User")}>User</button>
        <button className={styles.switchButton2}onClick={() => handleRoleChange("Admin")}>Admin</button>
        
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoginFormClient;

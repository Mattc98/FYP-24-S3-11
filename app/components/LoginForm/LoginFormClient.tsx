'use client'; // This is a client-side component for handling state and form interactions.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string; // Store hashed passwords instead for security
}

interface ClientLoginFormProps {
  userAccount: UserAccount[]; // Accepting userAccount as a prop
}

const LoginFormClient: React.FC<ClientLoginFormProps> = ({ userAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = userAccount.find(user => user.Username === username);
    if (user && user.Password === password) {
      setMessage('Login Successful');
      router.push(`/UserHomepage?username=${username}&userID=${user.UserID}`);
    } else {
      setMessage('Invalid username or password');
    }
  };

  return (
    <div>
        <button className={styles.switchButton1}>User</button>
        <button className={styles.switchButton2}>Admin</button>
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

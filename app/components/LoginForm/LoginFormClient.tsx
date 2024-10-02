'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director"; // Defined roles
}

interface ClientLoginFormProps {
  userAccount: UserAccount[];
}

const LoginFormClient: React.FC<ClientLoginFormProps> = ({ userAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<"User" | "Admin">('User'); // Defaulting to 'User'
  const [headerText, setHeaderText] = useState('User Login');
  const router = useRouter();

  // Redirection URLs
  const homepageRedirect = {
    Admin: '/AdminHomepage',
    User: '/UserHomepage',
    Director: '/UserHomepage', // Director treated same as User
  };

  const lowercaseUsername = username.toLowerCase();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = userAccount.find(user => user.Username.toLowerCase() === lowercaseUsername);

    if (user && user.Password === password) {
      if ((role === "Admin" && user.Role === "Admin") || (role === "User" && (user.Role === "User" || user.Role === "Director"))) {
        // Successful login for Admin or User/Director
        setMessage(`${user.Role} Login Successful`);
        const redirectUrl = `${homepageRedirect[user.Role]}?username=${username}`;
        router.push(redirectUrl);
      } else {
        // Access denied if role doesn't match the account type
        setMessage('Access Denied');
      }
    } else {
      setMessage('Invalid username or password');
    }
  };
  
  const handleRoleChange = (selectedRole: "User" | "Admin") => {
    setRole(selectedRole);
    setHeaderText(selectedRole === "Admin" ? "Admin Login" : "User Login");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-400 fon">{headerText}</h1>
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

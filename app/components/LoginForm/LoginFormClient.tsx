'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string;
  Role: "User" | "Admin" | "Director";
  FailLogin: number;
  IsLocked: boolean;
}

interface ClientLoginFormProps {
  userAccount: UserAccount[];
}

const LoginFormClient: React.FC<ClientLoginFormProps> = ({ userAccount }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<"User" | "Admin">('User');
  const [headerText, setHeaderText] = useState('User Login');
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  const homepageRedirect = {
    Admin: '/AdminHomepage',
    User: '/UserHomepage',
    Director: '/UserHomepage',
  };

  const updateUserAccount = async (updatedUser: UserAccount) => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: updatedUser.UserID,
          FailLogin: updatedUser.FailLogin,
          IsLocked: updatedUser.IsLocked,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user account');
      }
    } catch (error) {
      console.error('Error updating user account:', error);
    }
  };

  const lowercaseUsername = username.toLowerCase();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const user = userAccount.find(user => user.Username.toLowerCase() === lowercaseUsername);
  
    if (user) {
      if (user.IsLocked) {
        setMessage('Account is locked. Please contact administrator');
        setIsLocked(true);
        return;
      }
  
      if (user.Password === password) {
        // Check if the role matches for successful login
        if ((role === "Admin" && user.Role === "Admin") || 
            (role === "User" && (user.Role === "User" || user.Role === "Director"))) {
          
          // Successful login
          setMessage(`${user.Role} Login Successful`);
          const redirectUrl = `${homepageRedirect[user.Role]}?username=${username}`;
          
          // Reset FailLogin count on successful login
          await updateUserAccount({ ...user, FailLogin: 0, IsLocked: false });
  
          // Update local user account state
          user.FailLogin = 0;
          user.IsLocked = false;
  
          router.push(redirectUrl);
        } else {
          // Access denied if role doesn't match the account type
          setMessage('Access Denied');
        }
      } else {
        // Increment FailLogin count
        const newFailLogin = user.FailLogin + 1;
        const isLocked = newFailLogin >= 3;
        await updateUserAccount({ ...user, FailLogin: newFailLogin, IsLocked: isLocked });
  
        // Update local user account state
        user.FailLogin = newFailLogin;
        user.IsLocked = isLocked;
  
        if (isLocked) {
          setMessage('Account locked due to multiple failed attempts. Please contact administrator.');
          setIsLocked(true);
          return;
        } else {
          setMessage(`Invalid username or password. Attempts remaining: ${3 - newFailLogin}`);
        }
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
      <button className={styles.switchButton1} onClick={() => handleRoleChange("User")} disabled={isLocked}>User</button>
      <button className={styles.switchButton2} onClick={() => handleRoleChange("Admin")} disabled={isLocked}>Admin</button>        
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
        <button type="submit" className={styles.submitButton} disabled={isLocked}>
          Sign In
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
      <footer className="mt-8 text-center text-sm text-gray-500">
       © 2024 FYP-24-S3-11. All rights reserved.
     </footer>
    </div>
  );
};

export default LoginFormClient;
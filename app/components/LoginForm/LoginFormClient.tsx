'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from "cookies-next";
import { toast, Toaster } from 'sonner';

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
  const [selectedRole, setSelectedRole] = useState("User");
  const [isLocked, setIsLocked] = useState(false); // Assuming you have isLocked state
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
        if ((selectedRole === "Admin" && user.Role === "Admin") || 
            (selectedRole === "User" && (user.Role === "User" || user.Role === "Director"))) {
          
          // Successful login
          toast.success('Successfully logged in');
          
          // Reset FailLogin count on successful login
          await updateUserAccount({ ...user, FailLogin: 0, IsLocked: false });
  
          // Update local user account state
          user.FailLogin = 0;
          user.IsLocked = false;

          setCookie('username', username);
          setCookie('role', selectedRole);

          router.push(homepageRedirect[user.Role]);
        } else {
          // Access denied if role doesn't match the account type
          toast.error('Access Denied')
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
          toast.error('Account locked due to multiple failed attempts. Please contact administrator.');
          setIsLocked(true);
          return;
        } else {
          toast.error(`Invalid username or password. Attempts remaining: ${3 - newFailLogin}`);
        }
      }
    } else {
      toast.error('Invalid username or password');
    }
  };
  
  
  const handleRoleChange = (role:string) => {
    setSelectedRole(role);

  };


  return (
    <div className='sm:w-[600px] w-full p-10 mx-10'>
      <h2 className="text-4xl font-bold text-white text-center mb-6">Sign In</h2>
      <div className="flex justify-center items-center my-4 bg-neutral-500 rounded-lg p-1">
        <button
          className={`px-4 py-2 mr-1 rounded-lg cursor-pointer w-[50%] transition-colors ${
            selectedRole === "User" ? "bg-neutral-800 text-gray-300" : "bg-neutral-500 text-black"
          }`}
          onClick={() => handleRoleChange("User")}
        >
          User
        </button>
        <button
          className={`px-4 py-2 ml-1 rounded-lg cursor-pointer w-[50%] transition-colors ${
            selectedRole === "Admin" ? "bg-neutral-800 text-gray-300" : "bg-neutral-500 text-black"
          }`}
          onClick={() => handleRoleChange("Admin")}
        >
          Admin
        </button>
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-transparent border border-gray-300 p-2 rounded mb-4 w-full text-white placeholder-gray-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border border-gray-300 p-2 rounded mb-4 w-full text-white placeholder-gray-300"
            />
             <button
              type="submit"
              className="bg-gray-300 text-black p-2 rounded w-full mt-2 disabled:bg-blue-300"
              disabled={isLocked}
            >
              Sign In
            </button>
          </form>
          <Toaster richColors/>
        </div>
    </div>
  );
};

export default LoginFormClient;
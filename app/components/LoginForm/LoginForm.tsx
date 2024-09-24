//'use client'; // Client Side Component
import { calluser } from '@/aws_db/db';
//import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css'; // Make sure this file exists
import LoginFormClient from './LoginFormClient';


interface userAccount{
  UserId: number;
  Username: string;
  Password: string;
}

async function fetchuser(): Promise<userAccount[]> {
  try {
    const response = await calluser("SELECT * FROM userAccount");
    return JSON.parse(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch user data.');
  }
}


const LoginForm = async () => {
  const userAccounts = await fetchuser(); // Fetching user data on the server

  return (
    <div>
      <LoginFormClient userAccount={userAccounts} />
    </div>
  );
};

export default LoginForm;
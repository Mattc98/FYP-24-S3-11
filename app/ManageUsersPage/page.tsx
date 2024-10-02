'use client'; // Marks the component as a Client Component

import Navbar from '../components/Navbar';
import { calluser } from '@/aws_db/db';
import React, { Suspense, useEffect, useState } from 'react';

interface Users {
  UserID: number;
  Username: string;
}

const ManageUsersPage = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Assuming you're passing the correct SQL query to fetch users
        const response = await calluser('SELECT UserID, Username FROM UserAccount');
        setUsers(response as Users[]); // Assert that response is of type Users[]
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
        </Suspense>
      </div>
      <div>
        {loading ? (
          <div>Loading users...</div>
        ) : (
          <div>
            <h1>Manage Users</h1>
            <ul>
              {users.map((user) => (
                <li key={user.UserID}>
                  {user.Username} (ID: {user.UserID})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;

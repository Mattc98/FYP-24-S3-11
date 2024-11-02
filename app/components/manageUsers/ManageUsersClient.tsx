'use client'; // Marks this component as a Client Component
import React, { useEffect, useState } from 'react';
import RoleDropdown from './RoleDropdown'; // Ensure you import RoleDropdown correctly
import { toast, Toaster } from 'sonner';

interface UserAccount {
  UserID: number;
  Username: string;
  Password: string;
  Email: string;
  Role: string; // Assuming users have roles
  ProfilePicture: string; // Assuming there's a profile picture URL
  FailLogin: number;
  IsLocked: boolean;
}

interface ManageUsersPageProps {
  users: UserAccount[]; // Receive users as a prop from the server component
}

const ManageUsersClient: React.FC<ManageUsersPageProps> = ({ users }) => {
  const [manageUsers, setManageUsers] = useState<UserAccount[]>(users); // Initialize state with fetched users
  const [editUsername, setEditUsername] = useState<string>('');
  const [editRole, setEditRole] = useState<string>(''); // State for the role
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setManageUsers(users); // Update users when the prop changes
    setLoading(false); // Set loading to false once users are fetched
  }, [users]);

  const unlockUser = async (userID: number) => {
    try {
      const response = await fetch('api/unlockUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userID,
          FailLogin: 0,
          IsLocked: false, // Assuming IsLocked is a boolean
        }),
      });

      if (response.ok) {
        toast.success("User has been unlocked. Do remember to inform them that their account is unlocked.");
      } else {
        console.log("Failed to unlock user");
      }
    } catch (error) {
      console.error("Error unlocking user:", error);
    }
  };

  // Handle edit button click
  const handleEdit = async (userID: number) => {
    try {
      const response = await fetch('/api/manageUsers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userID, newUsername: editUsername, newRole: editRole }), // Send ID, new username, and new role
      });

      if (response.ok) {
        setManageUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.UserID === userID ? { ...user, Username: editUsername, Role: editRole } : user
          )
        );
        setEditUsername(''); // Clear the input
        setEditRole(''); // Clear the role
        setCurrentUserId(null); // Reset current user ID
        toast.success('User successfully updated!'); // Show success message
      }
    } catch (error) {
      alert('Error updating user'); // Show error message
      console.error('Error updating user:', error);
    }
  };

  // Function to initiate editing
  const initiateEdit = (userID: number, username: string, role: string) => {
    setCurrentUserId(userID); // Set the current user ID
    setEditUsername(username); // Pre-fill the input with the existing username
    setEditRole(role); // Pre-fill the input with the existing role
  };

  // Function to handle user termination
  const terminateUser = async (userID: number) => {
    try {
      const response = await fetch('/api/manageUsers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userID }), // Send ID for deletion
      });

      if (response.ok) {
        setManageUsers((prevUsers) => prevUsers.filter((user) => user.UserID !== userID));
        toast.success('User successfully terminated!'); // Show success message
      }
    } catch (error) {
      alert('Error terminating user'); // Show error message
      console.error('Error terminating user:', error);
    }
  };

  // Function to cancel editing
  const cancelEdit = () => {
    setCurrentUserId(null); // Reset current user ID
    setEditUsername(''); // Clear the edit username input
    setEditRole(''); // Clear the edit role input
  };

  const addUser = async (userData: { username: string; password: string; email: string; role: string }) => {
    try {
      const response = await fetch('/api/manageUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: userData.username,
          Password: userData.password,
          Email: userData.email,
          Role: userData.role,
          ProfilePicture: '/images/profile-icon.png', // Default profile picture
        }),
      });

      if (response.ok) {
        const newUser = await response.json(); // Assuming the API returns the created user
        setManageUsers((prevUsers) => [...prevUsers, newUser]); // Add new user to the list
        setIsModalOpen(false); // Close the modal
        toast.success('User successfully created!'); // Show success message
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Username or Email already exists') {
          toast.error('Error: Username or Email already exists.');
        } else {
          toast.error('Error creating user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">Manage Users</h1>

        {/* Add User Button */}
        <button
          onClick={() => setIsModalOpen(true)} // Open the modal when clicked
          className="bg-neutral-600 text-white px-4 py-2 rounded mb-4 hover:bg-neutral-500"
        >
          Add User
        </button>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div>
            {manageUsers.length > 0 ? (
              <ul className="space-y-4">
                {manageUsers.map((user) => (
                  <li key={user.UserID} className="flex items-center bg-neutral-900 p-4 rounded-md shadow-md">
                    <div className="relative mr-4">
                      <p>UserID: {user.UserID}</p>
                      <img
                        src={user.ProfilePicture || '/images/profile-icon.png'}
                        alt={`${user.Username} profile`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Name:</p>
                      <input
                        type="text"
                        value={currentUserId === user.UserID ? editUsername : user.Username}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="border border-gray-300 p-1 rounded w-48 text-black"
                        readOnly={currentUserId !== user.UserID}
                      />
                      <p className="font-semibold">Role:</p>
                      <input
                        type="text"
                        value={currentUserId === user.UserID ? editRole : user.Role}
                        onChange={(e) => setEditRole(e.target.value)} // Update role during edit
                        className="border border-gray-300 p-1 rounded w-48 text-black"
                        readOnly={currentUserId !== user.UserID}
                      />
                    </div>
                    <div className="flex space-x-2">
                      {currentUserId === user.UserID ? (
                        <>
                          <button
                            onClick={() => handleEdit(user.UserID)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => initiateEdit(user.UserID, user.Username, user.Role)}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => terminateUser(user.UserID)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Terminate
                      </button>
                      <button
                        onClick={() => unlockUser(user.UserID)}
                        className="bg-teal-600 text-white px-2 py-1 rounded"
                      >
                        Unlock
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}
        <Toaster richColors/>
      </div>

      {/* Modal for Adding User */}
      <RoleDropdown
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addUser={addUser} // Pass the correct addUser function
      />
    </div>
  );
};

export default ManageUsersClient;

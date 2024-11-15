import React, { useState, useEffect } from 'react';
import RoleInput from './RoleInput'; // Use RoleInput for selecting roles

interface RoleDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  addUser: (userData: { username: string; password: string; email: string; role: string }) => void;
}

const RoleDropdown: React.FC<RoleDropdownProps> = ({ isOpen, onClose, addUser }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('User'); // Default role

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Password validation criteria
  const passwordRequirements = {
    minLength: 8,
    hasNumber: /\d/,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/ // Checks for at least one special character
  };

  // Reset form fields and error whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setNewUsername('');
      setNewPassword('');
      setNewEmail('');
      setNewRole('User'); // Reset to default role if necessary
      setError(null); // Clear error messages
    }
  }, [isOpen]);

  const handleAddUser = () => {
    // Simple validation check
    if (!newUsername || !newPassword || !newEmail || !newRole) {
      setError('All fields are required.');
      return;
    }

    // Password validation check
    if (newPassword.length < passwordRequirements.minLength ||
        !passwordRequirements.hasNumber.test(newPassword) ||
        !passwordRequirements.hasUpperCase.test(newPassword) ||
        !passwordRequirements.hasLowerCase.test(newPassword) ||
        !passwordRequirements.hasSpecialChar.test(newPassword)) {
      setError('Password must be at least 8 characters, include a number, an uppercase letter, a lowercase letter, and a special character.');
      return;
    }

    // If validation passes, proceed to add user
    addUser({ username: newUsername, password: newPassword, email: newEmail, role: newRole });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-neutral-700 p-6 rounded shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4">Add New User</h2>

        {/* Display error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-2">
          <label className="block font-medium">Username</label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Email</label>
          <input
            type="text"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full text-black"
          />
        </div>
        <div className="mb-2">
          <label className="block font-medium">Role</label>
          <RoleInput
            value={newRole}
            onChange={setNewRole} // Update newRole state
            className="w-full"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add User
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleDropdown;

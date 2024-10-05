import React, { Suspense } from 'react';
import ManageUsersClient from '../components/manageUsers/ManageUsersPage';
import Navbar from '../components/Navbar';

const ManageUsersPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
      </Suspense>
      <ManageUsersClient />
    </div>
  );
};

export default ManageUsersPage;

import React, { Suspense } from 'react';
import ManageUsersClient from '../components/manageUsers/ManageUsersPage';
import AdminNavbar from '../components/adminNavbar';

const ManageUsersPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
          <AdminNavbar/>
      </Suspense>
      <ManageUsersClient />
    </div>
  );
};

export default ManageUsersPage;
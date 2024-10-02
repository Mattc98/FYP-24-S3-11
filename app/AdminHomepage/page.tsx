"use client"
import Navbar from '../components/Navbar';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';



const AdminHomepage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get('username');

    const routeManageUsers = () =>{
        router.push(`/ManageUsersPage?username=${username}`)
    }

  return (
    <div>
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
        </div>
        <div>
            <button onClick={routeManageUsers}>Manage Users</button>
        </div>
    </div>
  )
}

export default AdminHomepage
import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <>
      <AdminNavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
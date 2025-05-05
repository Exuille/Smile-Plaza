import React from 'react';
import AdminNavBar from '../components/AdminNavBar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div
      style={{
        backgroundImage: "url('main-background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100%"
      }}
    >
      <AdminNavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
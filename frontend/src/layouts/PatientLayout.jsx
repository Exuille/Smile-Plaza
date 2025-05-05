import React from 'react';
import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';

const PatientLayout = () => {
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
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
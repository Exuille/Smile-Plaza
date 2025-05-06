import { Navigate, Outlet } from "react-router-dom";
import React from 'react';
import NavBar from '../components/NavBar';

const Protected = () => {
  const token = localStorage.getItem("token");
  return token ? (
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
      <NavBar data={{token}}/>
      <main>
        <Outlet />
      </main>
    </div>
    ) : 
    <Navigate to="/login" />;
};

export default Protected;
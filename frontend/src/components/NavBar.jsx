import React from 'react';
import { NavLink } from 'react-router-dom';
import '../static/navbar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="nav-start">
        <img src="logo.png" alt="Smile Plaza Logo" className="logo" />
        <div className="text-container">
          <h2>Smile Plaza</h2>
          <h3>Dental Center</h3>
        </div>
      </div>
      <div className="nav-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Home
        </NavLink>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/announcement" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Announcements & Clinic Hours
        </NavLink>
        <NavLink 
          to="/appointment" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Appointments
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
        >
          Contact Us
        </NavLink>
      </div>
      <div className="nav-end">
        <NavLink 
          to="/login" 
          className="login-btn"
        >
          Login
        </NavLink>
        <NavLink 
          to="/signup" 
          className="signup-btn"
        >
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
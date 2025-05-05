import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../static/navbar.css';

const AdminNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="nav-start">
        <img src="logo.png" alt="Smile Plaza Logo" className="logo" />
        <div className="text-container">
          <h2>Smile Plaza</h2>
          <h3>Dental Center</h3>
        </div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <div className="nav-center">
          <NavLink 
            to="/admin" 
            end
            className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/announcement" 
            className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
          >
            Announcements & Clinic Hours
          </NavLink>
          <NavLink 
            to="/admin/userlog" 
            className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}
          >
            User Log
          </NavLink>
        </div>
      </div>

      <div className={`nav-end admin ${menuOpen ? 'mobile-visible' : ''}`}>
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

export default AdminNavBar;
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../static/navbar.css';

const NavBar = ({data}) => {
  const navigate = useNavigate();
  const token = data.token
  
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.replace('/');
  }

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
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Home
          </NavLink>
          {
            token ?
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
                Dashboard
              </NavLink>
            : null
          }
          {
            token ?
              <NavLink to="/appointment" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
                Appointments
              </NavLink>
            : null
          }
          <NavLink to="/announcement" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Announcements & Clinic Hours
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
            Contact Us
          </NavLink>
        </div>
      </div>
      <div className={`nav-end patient ${menuOpen ? 'mobile-visible' : ''}`}>
      {
        token ?
          <div className="nav-end-signin">
            <a style={{cursor: "pointer"}} onClick={logout} className="login-btn">Logout</a>
            <a href="/profile"><img src="default-profile.png" className="profile-picture" alt="Profile Picture" /></a>
          </div>
        : 
          <NavLink to="/login" className="login-btn">Login</NavLink>
      }
      {
        token ?
          null
        : 
          <NavLink to="/signup" className="signup-btn">Sign Up</NavLink>
      }
      </div>
    </nav>
  );
};

export default NavBar;

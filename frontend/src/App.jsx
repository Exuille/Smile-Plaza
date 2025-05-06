import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Public pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Patient pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfile from './pages/patient/Profile';
import PatientAppointment from './pages/patient/Appointment';
import PatientAnnouncement from './pages/patient/Announcement';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import AdminAnnouncement from './pages/admin/Announcement';
import AdminAppointment from './pages/admin/Appointment';
import AdminUserLog from './pages/admin/UserLog';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import AdminLayout from './layouts/AdminLayout';
import Protected from './layouts/Protected';

function App() {
  return (
    <Routes>
      {/* Public and Patient Routes */}
      <Route path="/" element={<PatientLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="announcement" element={<PatientAnnouncement />} />
      </Route>
      <Route path="/" element={<Protected />}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="appointment" element={<PatientAppointment />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="announcement" element={<AdminAnnouncement />} />
        <Route path="appointment" element={<AdminAppointment />} />
        <Route path="userlog" element={<AdminUserLog />} />
      </Route>
    </Routes>
  );
}

export default App;
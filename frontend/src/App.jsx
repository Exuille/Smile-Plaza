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
import RoleProtected from './layouts/RoleProtected';

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PatientLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login data={{token}}/>} />
        <Route path="signup" element={<Signup data={{token}}/>} />
        <Route path="announcement" element={<PatientAnnouncement />} />
      </Route>

      {/* Patient Routes */}
      <Route element={<RoleProtected allowedRole="patient" data={{token}} />}>
        <Route path="/" element={<PatientLayout />}>
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="appointment" element={<PatientAppointment />} />
        {/*<Route path="/" element={<Protected data={{token}} />}>*/}
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleProtected allowedRole="admin" data={{token}} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="announcement" element={<AdminAnnouncement data={{token}}/>} />
          <Route path="appointment" element={<AdminAppointment />} />
          <Route path="userlog" element={<AdminUserLog />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
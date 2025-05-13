import React, { useState, useEffect } from 'react';
import '../../static/dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3001/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user');

      const data = await res.json();
      setUser(data.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/appointment/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAppointments();
  }, []);

  const handleAction = async (action, index) => {
    const selectedAppointment = appointments[index];

    if (selectedAppointment.status === 'cancelled' && action !== 'Delete Entry') {
      alert("You can't edit a cancelled appointment.");
      return;
    }

    try {
      if (action === 'Delete Entry') {
        const response = await fetch(`http://localhost:3001/appointment/${selectedAppointment.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete appointment');
        }

        setAppointments(appointments.filter((_, i) => i !== index));
      } else {
        let newStatus;
        if (action === 'Mark as Completed') {
          newStatus = 'completed';
        } else if (action === 'Mark as Reserved') {
          newStatus = 'accepted';
        }

        const response = await fetch(`http://localhost:3001/appointment/${selectedAppointment.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Failed to update appointment status');
        }

        const updated = [...appointments];
        updated[index].status = newStatus;
        setAppointments(updated);
      }

      setOpenMenuIndex(null);
      fetchAppointments();
    } catch (error) {
      console.error(`Failed to perform action ${action}:`, error);
    }
  };

  if (user && user.role !== 'admin') {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>SERVICE</th>
              <th>STATUS</th>
              <th>FEEDBACK</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment.id}>
                <td>{appointment.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.service}</td>
                <td>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status.toUpperCase()}
                  </span>
                </td>
                <td>{appointment.feedback_status !== 'none' ? appointment.feedback_status : '—'}</td>
                <td className="action-cell">
                  <button
                    className="action-btn"
                    onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                  >
                    ...
                  </button>
                  {openMenuIndex === index && (
                    <div
                      className="dropdown-menu"
                      style={{
                        top: index === appointments.length - 1 ? 'auto' : '35px',
                        bottom: index === appointments.length - 1 ? '35px' : 'auto',
                      }}
                    >
                      <button onClick={() => handleAction('Mark as Reserved', index)}>Mark as Reserved</button>
                      <button onClick={() => handleAction('Mark as Completed', index)}>Mark as Completed</button>
                      {/* <button onClick={() => handleAction('Delete Entry', index)}>Delete Entry</button> */}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

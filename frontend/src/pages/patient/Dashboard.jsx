import React, { useEffect, useState } from 'react';
import '../../static/dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const res = await fetch('http://localhost:3001/appointment/myAppointments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch appointments');
      }

      const json = await res.json();

      if (!Array.isArray(json.data?.appointments)) {
        console.error('Unexpected API response format:', json);
        throw new Error('Invalid appointments data format');
      }

      setAppointments(json.data.appointments);
    } catch (err) {
      console.error('Error fetching appointments:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const res = await fetch(`http://localhost:3001/appointment/cancel/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to cancel appointment');
      }

      fetchAppointments(); 

    } catch (err) {
      console.error('Error cancelling appointment:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="table-wrapper">
        <table className="table-header">
          <thead>
            <tr>
              <th>NAME</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>SERVICE</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
        </table>
        <div className="table-body-wrapper">
          <table className="table-body">
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="6">No appointments found.</td>
                </tr>
              ) : (
                appointments.map((appointment, index) => (
                  <tr key={appointment.id || index}>
                    <td>{appointment.name}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.service}</td>
                    <td>
                      <span className={`status-badge status-${appointment.status?.toLowerCase()}`}>
                        {appointment.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      {appointment.status?.toLowerCase() === 'pending' && (
                        <button
                          className="action-btn"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

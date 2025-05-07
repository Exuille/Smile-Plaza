import React, { useState, useEffect } from 'react';
import '../../static/dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  useEffect(() => {
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
        console.log(data.data.appointments, "aaaaaaaa")
        setAppointments(data.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleAction = async (action, index) => {
    const selectedAppointment = appointments[index];

    try {
      if (action === 'Delete Entry') {
        const response = await fetch(`http://localhost:3000/appointment/${selectedAppointment._id}`, {
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
        const response = await fetch(`http://localhost:3000/appointment/${selectedAppointment._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: action === 'Mark as Completed' ? 'Completed' : 'Reserved' }),
        });

        if (!response.ok) {
          throw new Error('Failed to update appointment status');
        }

        const updated = [...appointments];
        updated[index].status = action === 'Mark as Completed' ? 'Completed' : 'Reserved';
        setAppointments(updated);
      }

      setOpenMenuIndex(null);
    } catch (error) {
      console.error(`Failed to perform action ${action}:`, error);
    }
  };

  const handleFeedbackChange = async (index, newValue) => {
    const updatedAppointments = [...appointments];
    const appointmentToUpdate = updatedAppointments[index];
    appointmentToUpdate.feedback = newValue;

    try {
      const response = await fetch(`http://localhost:3000/appointment/${appointmentToUpdate._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: newValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update feedback');
      }

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Failed to update feedback:', error);
    }
  };

  console.log(appointments)

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
              <tr key={appointment._id}>
                <td>{appointment.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>2
                <td>{appointment.service}</td>
                <td>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <select
                    value={appointment.feedback || ''}
                    onChange={(e) => handleFeedbackChange(index, e.target.value)}
                  >
                    <option value="Not available. Make a new appointment.">Not available. Make a new appointment.</option>
                    <option value="You've been approved.">You've been approved.</option>
                    <option value="Mark as Completed.">Mark as Completed.</option>
                  </select>
                </td>
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
                      <button onClick={() => handleAction('Delete Entry', index)}>Delete Entry</button>
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

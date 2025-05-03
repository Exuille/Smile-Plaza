import React, { useState } from 'react';
import '../../static/dashboard.css';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([
    {
      name: 'John Doe',
      date: '2025-05-01',
      time: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'Completed',
      feedback: 'Not available. Make a new appointment.'
    },
    {
      name: 'Jane Smith',
      date: '2025-05-02',
      time: '2:00 PM',
      service: 'Eye Checkup',
      status: 'Pending',
      feedback: "You've been approved."
    },
    {
      name: 'Robert Brown',
      date: '2025-05-03',
      time: '9:30 AM',
      service: 'Physical Therapy',
      status: 'Cancelled',
      feedback: 'Mark as Completed.'
    }
  ]);

  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const handleAction = (action, index) => {
    console.log(`Action "${action}" clicked on row ${index}`);
    setOpenMenuIndex(null);
  };

  const handleFeedbackChange = (index, newValue) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].feedback = newValue;
    setAppointments(updatedAppointments);
  };

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
              <tr key={index}>
                <td>{appointment.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.service}</td>
                <td>
                  <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <select
                    value={appointment.feedback}
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
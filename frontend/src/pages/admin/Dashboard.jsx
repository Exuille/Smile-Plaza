import React, { useState } from 'react';
import '../../static/dashboard.css';

const Dashboard = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      name: 'John Doe',
      date: '2025-05-01',
      time: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'Completed',
      feedback: 'Nice.'
    },
    {
      name: 'Jane Smith',
      date: '2025-05-02',
      time: '2:00 PM',
      service: 'Eye Checkup',
      status: 'Pending',
      feedback: 'Waiting.'
    },
    {
      name: 'Robert Brown',
      date: '2025-05-03',
      time: '9:30 AM',
      service: 'Physical Therapy',
      status: 'Cancelled',
      feedback: 'Hindi ka nya gusto.'
    }
  ]);

  const handleAction = (action, index) => {
    const updated = [...appointments];
    if (action === 'Delete Entry') {
      updated.splice(index, 1);
    } else if (action === 'Mark as Reserved') {
      updated[index].status = 'Reserved';
    } else if (action === 'Mark as Completed') {
      updated[index].status = 'Completed';
    }
    setAppointments(updated);
    setOpenMenuIndex(null); // Close the dropdown
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
                  <input type="text" placeholder="Feedback" />
                </td>
                <td className="action-cell">
                  <button onClick={() =>
                    setOpenMenuIndex(openMenuIndex === index ? null : index)
                  }>
                    ...
                  </button>
                  {openMenuIndex === index && (
                    <div className="dropdown-menu">
                      <button className="action-btn" onClick={() => handleAction('Mark as Reserved', index)}>
                        Mark as Reserved
                      </button>
                      <button className="action-btn" onClick={() => handleAction('Mark as Completed', index)}>
                        Mark as Completed
                      </button>
                      <button className="action-btn" onClick={() => handleAction('Delete Entry', index)}>
                        Delete Entry
                      </button>
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

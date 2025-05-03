import React from 'react';
import '../css/patient/Dashboard.css';

const Dashboard = () => {
  const appointments = [
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
  ];

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
                <td>{appointment.feedback}</td>
                <td>
                  <button>Cancel</button>
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
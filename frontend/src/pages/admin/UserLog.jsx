import React from 'react';

const UserLog = () => {
  const users = [
    {
      name: 'John Doe',
      date: '2025-05-01',
      time: '10:00 AM',
      service: 'Dental Cleaning',
      status: 'Completed',
      feedback: 'Nice.'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.date}</td>
                <td>{user.time}</td>
                <td><button className="action-btn">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLog;

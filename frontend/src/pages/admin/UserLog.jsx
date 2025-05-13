import React, { useEffect, useState } from 'react';

const UserLog = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/fetch', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch current user');
      
      setCurrentUser(data.data); 
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Unauthorized: Only admins can delete users.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/auth/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete user');
      alert('User deleted successfully');
      fetchUsers(); 
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="table-wrapper">
        <table className="table-header">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ACTION</th>
            </tr>
          </thead>
        </table>
        <div className="table-body-wrapper">
          <table className="table-body">
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {currentUser?.role === 'admin' && (
                      <button className="action-btn" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserLog;

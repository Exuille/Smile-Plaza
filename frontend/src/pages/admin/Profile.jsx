import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/profile.css';
import * as images from '../../assets/img/img.js';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [userId, setUserId] = useState(null); 
  const [error, setError] = useState('');

  const infoBtns = useRef();
  const nameInp = useRef();
  const emailInp = useRef();
  const contactInp = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:3001/auth/fetch', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        console.log('Fetched user:', data);

        // Set user data to state
        setUserId(data.data.id);  
        setName(data.data.name || '');
        setEmail(data.data.email || '');
        setContact(data.data.contact || '');
      } catch (err) {
        console.error(err);
        alert('Unable to fetch user info');
      }
    };

    fetchUser();
  }, [navigate]);

  const editProfile = () => {
    infoBtns.current.style.display = 'flex';
    nameInp.current.disabled = false;
    emailInp.current.disabled = false;
    contactInp.current.disabled = false;
  };

  const cancel = () => {
    infoBtns.current.style.display = 'none';
    nameInp.current.disabled = true;
    emailInp.current.disabled = true;
    contactInp.current.disabled = true;
  };

  const save = async () => {
  try {
    setError('');
    infoBtns.current.style.display = 'none';
    nameInp.current.disabled = true;
    emailInp.current.disabled = true;
    contactInp.current.disabled = true;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not authorized to edit this account.');
      return;
    }

    const response = await fetch(`http://localhost:3001/auth/account/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        contactInfo: contact,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save changes');
    }

    alert('Information saved successfully');
  } catch (err) {
    console.error(err);
    setError(err.message || 'Unable to save information');
  }
  };


  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const deleteAcc = () => {
    alert('Account deletion logic not yet implemented');
  };

  const changeValue = (e) => {
    const { id, value } = e.target;
    if (id === 'name') setName(value);
    if (id === 'email') setEmail(value);
    if (id === 'contact') setContact(value);
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-top-container">
          <img className="profile-top-pic" src={images.logo} />
          <div className="profile-top-info">
            <p className="name"><strong>{name}</strong></p>
            <p className="email">{email}</p>
            <p style={{color: "red"}}>Admin</p>
          </div>
        </div>

        <div className="profile-info-container">
          <div className="profile-info">
            <label className="profile-label">Name</label>
            <input 
              ref={nameInp} 
              className="profile-input" 
              id="name" 
              onChange={changeValue} 
              value={name} 
              disabled 
            />
          </div>
          <div className="profile-info">
            <label className="profile-label">Email</label>
            <input 
              ref={emailInp} 
              className="profile-input" 
              type="email" 
              id="email" 
              onChange={changeValue} 
              value={email} 
              disabled 
            />
          </div>
          <div className="profile-info">
            <label className="profile-label">Contact Number</label>
            <input 
              ref={contactInp} 
              className="profile-input" 
              type="text" 
              id="contact" 
              onChange={changeValue} 
              value={contact} 
              disabled 
            />
          </div>
          <div ref={infoBtns} className="profile-info-btns">
            <button className="btn deleteBtn" onClick={cancel}>Cancel</button>
            <button className="btn saveBtn" onClick={save}>Save</button>
          </div>
        </div>

        <div className="profile-btns-container">
          <div className="profile-top-btns">
            <button className="btn defaultBtn" onClick={logout}>Logout</button>
            <button onClick={editProfile} className="btn defaultBtn">Edit Profile</button>
            <button className="btn defaultBtn">Reset Password</button>
          </div>
          {/* <button className="btn deleteBtn" onClick={deleteAcc}>Delete Profile</button> */}
        </div>
      </div>
    </div>
  );
};

export default Profile;

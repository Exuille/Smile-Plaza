import React, { useState, useEffect } from 'react';
import '../../static/announcement.css';

const Announcement = () => {
  const [activeTab, setActiveTab] = useState('clinic'); // default tab
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (activeTab !== 'announcement') return;

    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/announcement', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setAnnouncements(data.data.announcements);
      } catch (err) {
        console.error('Error fetching announcements:', err.message);
      }
    };

    fetchAnnouncements();
  }, [activeTab]);

  return (
    <div className="announcement-container">
      <div className="tab">
        <div className="tab-btn">
          <button
            className={activeTab === 'clinic' ? 'active' : ''}
            onClick={() => setActiveTab('clinic')}
          >
            Clinic Hours
          </button>
          <button
            className={activeTab === 'announcement' ? 'active' : ''}
            onClick={() => setActiveTab('announcement')}
          >
            Announcement
          </button>
        </div>
        <hr />
        {activeTab === 'clinic' && (
          <div className="clinic-hours">
            <h2>Clinic Hours</h2>
            <table className="clinic-table">
              <thead>
                <tr>
                  <th colSpan="2">Appointment Available</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sunday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Monday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Tuesday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Wednesday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Thursday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Friday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
                <tr>
                  <td>Saturday</td>
                  <td>8:00 A.M. – 5:30 P.M.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'announcement' && (
          <div className="announcement">
            <h2>Announcement</h2>
            {announcements.length > 0 ? (
              announcements.map((item, index) => (
                <div className="announcement-content" key={index}>
                  <h5>Title: {item.title}</h5>
                  <p className="date">{new Date(item.dateTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p>Content: {item.content}</p>
                </div>
              ))
            ) : (
              <p>No announcements available.</p>
            )}
          </div>
        )}
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.5161744894394!2d121.4259652!3d13.927843099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd47d1efa357e5%3A0x85895f3c5c8ff9d!2sSmile%20Plaza%20Dental%20Center!5e0!3m2!1sen!2sph!4v1746203450112!5m2!1sen!2sph"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Smile Plaza Dental Center"
      ></iframe>
    </div>
  );
};

export default Announcement;
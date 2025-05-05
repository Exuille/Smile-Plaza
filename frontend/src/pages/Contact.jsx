import React, { useState } from 'react';
import '../static/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    subject: '',
    content: ''
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('Sending...');
    try {
      const res = await fetch('http://localhost:3000/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback('Message sent successfully!');
        setFormData({ name: '', email: '', contact: '', subject: '', content: '' });
      } else {
        setFeedback(data.message || 'Failed to send message.');
      }
    } catch (error) {
      setFeedback('Error sending message. Please try again later.');
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-left-panel">
        <div className="contact-left-text-container">
          <p className="heading">Contact Us</p>
          <p className="basic-text">Visit us for consultation!</p>
          <br />
          <p className="basic-text">
            Smile Plaza Dental Center is ready to cater to your dental needs. Ensuring your smile is at its best, and providing a comfortable and rewarding dental experience.
          </p>
        </div>
      </div>
      <div className="contact-right-panel">
        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="heading">Send Us Your Concerns</p>
          <hr />
          <input type="text" id="name" className="contact-input" placeholder="Name" required value={formData.name} onChange={handleChange} />
          <input type="email" id="email" className="contact-input" placeholder="Email" required value={formData.email} onChange={handleChange} />
          <input type="text" id="contact" className="contact-input" placeholder="Contact Number" required value={formData.contact} onChange={handleChange} />
          <input type="text" id="subject" className="contact-input" placeholder="Subject" required value={formData.subject} onChange={handleChange} />
          <textarea id="content" className="contact-textarea" placeholder="Message here" maxLength="100" required value={formData.content} onChange={handleChange}></textarea>
          <button type="submit" className="contact-btn">Submit</button>
          <p className="feedback">{feedback}</p>
        </form>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import '../static/contact.css';

const Contact = () => {
	return (
	  <div className="contact-container">
      <div className="contact-left-panel">
        <div className="contact-left-text-container">
          <p className="heading">Contact Us</p>
          <p className="basic-text">Visit us for consultation!</p>
          <br></br>
          <p className="basic-text">
          Smile Plaza Dental Center is ready to cater to your dental needs. Ensuring your smile is at its best, and providing a comfortable and rewarding dental experience.</p>
        </div>
      </div>
      <div className="contact-right-panel">
        <form className="contact-form">
        <p className="heading">Send Us Your Concerns</p>
        <hr />
            <input type="text" id="name" className="contact-input" placeholder="Name" required />
            <input type="email" id="email" className="contact-input" placeholder="Email" required />
            <input type="text" id="contact" className="contact-input" placeholder="Contact Number" required />
            <input type="text" id="subject" className="contact-input" placeholder="Subject" required />
            <textarea name="content" id="content" className="contact-textarea" placeholder="Message here" maxLength="100" required></textarea>
          <button type="submit" className="contact-btn">Submit</button>
          <p className="feedback"></p>
        </form>
      </div>
	  </div>
	);
};

export default Contact;
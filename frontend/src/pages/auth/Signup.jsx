import React, { Component } from 'react';
import '../../static/auth.css';

class Signup extends Component {
  render() {
    return (
      <div className="auth-container">
        <h2>Sign Up</h2>
        <hr />
        <form className="auth-form">
            <div className="names-container">
              <div>
                <label htmlFor="firstName" className="auth-label">First Name</label>
                <input type="name" id="firstName" className="auth-input" required />
              </div>
              <div>
                <label htmlFor="lastName" className="auth-label">Last Name</label>
                <input type="name" id="lastName" className="auth-input" required />
              </div>
            </div>
            <label htmlFor="email" className="auth-label">Email</label>
            <input type="email" id="email" className="auth-input" required />
            <label htmlFor="password" className="auth-label">Password</label>
            <input type="password" id="password" className="auth-input" required />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <div className="signup-recovery-a">
          <a href="/login" className="link"><strong>Already have an account?</strong></a>
        </div>
        <p className="feedback"></p>
      </div>
    );
  }
}

export default Signup;
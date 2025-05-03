import React, { Component } from 'react';
import '../css/auth/Auth.css';

class Signup extends Component {
  render() {
    return (
      <div className="auth-container">
        <h2>Sign Up</h2>
        <hr />
        <form>
            <div className="names-container">
              <div>
                <label htmlFor="firstName">First Name</label>
                <input type="name" id="firstName" required />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input type="name" id="lastName" required />
              </div>
            </div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          <button type="submit">Sign Up</button>
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
import React, { Component } from 'react';
import '../../static/auth.css';

class Login extends Component {
  render() {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <hr />
        <form className="auth-form">
            <label htmlFor="email" className="auth-label">Email</label>
            <input type="email" id="email" className="auth-input" required />
            <label htmlFor="password" className="auth-label">Password</label>
            <input type="password" id="password" className="auth-input" required />
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <div className="signup-recovery-a">
          <a href="/signup" className="link"><strong>Create an account.</strong></a>
          <a href="/recovery" className="link"> Forgot Password?</a>
        </div>
        <p className="feedback"></p>
      </div>
    );
  }
}

export default Login;
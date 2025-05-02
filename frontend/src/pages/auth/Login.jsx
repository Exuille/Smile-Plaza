import React, { Component } from 'react';
import '../css/auth/Auth.css';

class Login extends Component {
  render() {
    return (
      <div className="auth-container">
        <h2>Login</h2>
        <hr />
        <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          <button type="submit">Login</button>
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
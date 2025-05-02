import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
import React, { Component } from 'react';

class Signup extends Component {
  render() {
    return (
      <div className="signup-container">
        <h2>Signup</h2>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" required />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  }
}

export default Signup;
import React, { useRef } from 'react';
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha'
import '../../static/auth.css';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const feedbackRef = useRef();
  const recaptcha = useRef()

  const login = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const captchaToken = recaptcha.current.getValue()

    if (!captchaToken) {
      alert('Please verify the reCAPTCHA!')
    } else {
      try {
        const res = await axios.post("http://localhost:3001/auth/login", {
          email, password, captchaToken
        })
        alert("logged in!")
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
      } catch(err) {
        if (err.response) {
          feedbackRef.current.textContent = err.response.data.message;
          console.error("Server error:", err.response.data.message);
        } else if (err.request) {
          console.error("No response:", err.request);
        } else {
          console.error("Request error:", err.message);
        }
      }
    }

  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <hr />
      <form className="auth-form">
          <label htmlFor="email" className="auth-label">Email</label>
          <input ref={emailRef} type="email" id="email" className="auth-input" required />
          <label htmlFor="password" className="auth-label">Password</label>
          <input ref={passwordRef} type="password" id="password" className="auth-input" required />
        <button onClick={login} type="submit" className="auth-btn">Login</button>
        <ReCAPTCHA className="recaptcha" ref={recaptcha} sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY} />
      </form>
      <div className="signup-recovery-a">
        <a href="/signup" className="link"><strong>Create an account.</strong></a>
        <a href="/recovery" className="link"> Forgot Password?</a>
      </div>
      <p className="feedback" ref={feedbackRef}></p>
    </div>
  );
}

export default Login;
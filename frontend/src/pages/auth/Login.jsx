import ReCAPTCHA from 'react-google-recaptcha'
import { jwtDecode } from "jwt-decode";
import React, { useRef } from 'react';
import '../../static/auth.css';
import axios from "axios";

const Login = ({data}) => {
  const token = data.token;
  if (token) {
    const decoded = jwtDecode(token);
    console.log(decoded.role)
    if (decoded.role == 'patient') window.location.replace('/');
    if (decoded.role == 'admin') window.location.replace('/admin');
  }

  const emailRef = useRef();
  const passwordRef = useRef();
  const feedbackRef = useRef();
  const recaptcha = useRef()

  const login = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const captchaToken = recaptcha.current.getValue();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      feedbackRef.current.textContent = "Please enter a valid email address.";
      return;
    }

    if (!captchaToken) {
      alert('Please verify the reCAPTCHA!');
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        email, password, captchaToken
      });
      localStorage.setItem("token", res.data.token);
      const decoded1 = jwtDecode(res.data.token);
      if (decoded1.role === 'patient') window.location.replace('/');
      if (decoded1.role === 'admin') window.location.replace('/admin');
    } catch (err) {
      if (err.response) {
        feedbackRef.current.textContent = err.response.data.message;
      } else if (err.request) {
        feedbackRef.current.textContent = "No response from server.";
      } else {
        feedbackRef.current.textContent = "Something went wrong.";
      }

      setTimeout(() => {
        emailRef.current.value = "";
        passwordRef.current.value = "";
        recaptcha.current.reset();
        feedbackRef.current.textContent = "";
        emailRef.current.focus();
      }, 3000);
    }
  };

  return (
    <div className="login-container auth-container">
      <h2>Login</h2>
      <hr />
      <form className="auth-form">
        <label htmlFor="email" className="auth-label">Email</label>
        <input ref={emailRef} type="email" id="email" className="auth-input" required />
        <label htmlFor="password" className="auth-label">Password</label>
        <input ref={passwordRef} type="password" id="password" className="auth-input" required />
        <div className="recapcha-container">
          <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY} />
        </div>
        <button onClick={login} type="submit" className="auth-btn">Login</button>
      </form>
      <div className="signup-recovery-a">
        <a href="/signup" className="link"><strong>Create an account.</strong></a>
      </div>
      <p className="feedback" ref={feedbackRef}></p>
    </div>
  );
}

export default Login;
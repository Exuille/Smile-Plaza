import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../static/auth.css';

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState({});

  const signup = async(e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      addValue("fields", "All fields are required.")
    } else {
      const name = firstName + " " + lastName
      try {
        const res = await axios.post("http://localhost:3001/auth/register", {
          name, email, password, role:"patient"
        })

        if (res.status == 201) {
          setFeedback("Account created.")
        }
      } catch(err) {
        if (err.response) {
          addValue("res", err.response.data.message)
          console.error("Server error:", err.response.data.message);
        } else if (err.request) {
          console.error("No response:", err.request);
        } else {
          console.error("Request error:", err.message);
        }
      }
    }
  }

  const addValue = (key, value) => {
    setFeedback(prev => ({
      ...prev,
      [key]: value
    }));
  }

  const removeValue = (key) => {
    setFeedback(prev => {
      const newData = {...prev};
      delete newData[key];
      return newData;
    })
  }

  useEffect(() => {
    if (firstName && lastName && email && password && confirmPassword) {
      if (feedback['fields']) {
        removeValue("fields")
      }
    } 
  }, [firstName, lastName, email, password, confirmPassword])

  useEffect(() => {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var digits = /[0-9]/g;
    var specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

    if (password) {
      if (password.length >= 8 &&
        password.match(lowerCaseLetters) &&
        password.match(upperCaseLetters) &&
        password.match(digits) &&
        password.match(specialChar)) {
          removeValue("len")
          removeValue("lowercase")
          removeValue("uppercase")
          removeValue("digit")
          removeValue("special")
      } else {
        if (password.length < 8) {
          addValue("len", "Password must be at least 8 characters.");
        } else {
          removeValue("len")
        }

        if (!password.match(lowerCaseLetters)) {
          addValue("lowercase", "Password must contain lowercase letter.")
        } else {
          removeValue("lowercase")
        }

        if (!password.match(upperCaseLetters)) {
          addValue("uppercase", "Password must contain uppercase letter.")
        } else {
          removeValue("uppercase")
        }

        if (!password.match(digits)) {
          addValue("digit", "Password must contain a digit.")
        } else {
          removeValue("digit")
        }

        if (!password.match(specialChar)) {
          addValue("special", "Password must contain special character.")
        } else {
          removeValue("special")
        }
      }
    }

    if (password != confirmPassword) {
      addValue("passwordEqual", "Passwords do not match.")
    } else {
      removeValue("passwordEqual")
    }
  }, [password, confirmPassword])

  const changeValue = (e) => {
    if (e.target.id == "firstName") {
      setFirstName(e.target.value)
    } else if (e.target.id == "lastName") {
      setLastName(e.target.value)
    } else if (e.target.id == "email") {
      setEmail(e.target.value)
    } else if (e.target.id == "password") {
      setPassword(e.target.value)
    } else if (e.target.id == "confirmPassword") {
      setConfirmPassword(e.target.value)
    }
  }

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <hr />
      <form className="auth-form">
          <div className="names-container">
            <div>
              <label htmlFor="firstName" className="auth-label">First Name</label>
              <input onChange={changeValue} type="name" id="firstName" className="auth-input" required />
            </div>
            <div>
              <label htmlFor="lastName" className="auth-label">Last Name</label>
              <input onChange={changeValue} type="name" id="lastName" className="auth-input" required />
            </div>
          </div>
          <label htmlFor="email" className="auth-label">Email</label>
          <input onChange={changeValue} type="email" id="email" className="auth-input" required />
          <label htmlFor="password" className="auth-label">Password</label>
          <input onChange={changeValue} type="password" id="password" className="auth-input" required />
          <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
          <input onChange={changeValue} type="password" id="confirmPassword" className="auth-input" required />
        <button onClick={signup} type="submit" className="auth-btn">Sign Up</button>
      </form>
      <div className="signup-recovery-a">
        <a href="/login" className="link"><strong>Already have an account?</strong></a>
      </div>
      <div className="feedback-container">
        {feedback ? 
          Object.keys(feedback).map((key) => {
            return (
              <p key={key} className="feedback">{feedback[key]}</p>
            )
          })
        : null}
      </div>
    </div>
  );
}

export default Signup;
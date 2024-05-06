// RegisterForm.js
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import "./style.css"; // Assuming your form styles are in this file

const RegisterForm = ({ toggleLoginForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    // Validate form data
    if (!username || !email || !password) {
      setRegistrationError("Please fill in all fields.");
      return;
    }

    try {
      // Send registration request
      // Replace 'YOUR_REGISTER_API_ENDPOINT' with your actual register API endpoint
      const response = await fetch("YOUR_REGISTER_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Handle successful registration (e.g., show success message or redirect)
        console.log("Registration successful");
      } else {
        setRegistrationError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      setRegistrationError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="register-form">
      {!showLoginForm ? (
        <div>
          <h2>Registration</h2>
          <form id="registrationForm" onSubmit={handleRegisterSubmit}>
            {/* Registration form inputs */}
            <div className="input-box">
              <span className="icon">
                <ion-icon name="person"></ion-icon>
              </span>
              <input
                id="uname"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="uname">Username</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <ion-icon name="mail-sharp"></ion-icon>
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <ion-icon name="lock-closed-sharp"></ion-icon>
              </span>
              <input
                id="passwd"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="passwd">Password</label>
            </div>
            <label>
              <input
                type="checkbox"
                checked={termsConditions}
                onChange={(e) => setTermsConditions(e.target.checked)}
              />{" "}
              I agree to the terms & conditions
            </label>
            <button type="submit" className="btn">
              Register
            </button>
          </form>
          {registrationError && <p className="error">{registrationError}</p>}
          {!showLoginForm && (
            <div className="login-register">
              <p>
                Already have an account?
                <a href="#" onClick={() => setShowLoginForm(true)}>
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <LoginForm toggleLoginForm={() => setShowLoginForm(false)} />
      )}
    </div>
  );
};

export default RegisterForm;

import React, { useState } from "react";
import IonIcon from "./Icon";
import RegisterForm from "./RegisterForm";
import Wrapper from "./Wrapper"; // Import the Wrapper component
import { useNavigate } from "react-router-dom";
// import "./style.css";

const LoginForm = ({ onClose }) => {
  // Pass onClose prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Send Login request
      const response = await fetch("http://localhost:1337/api/login", {
        // Adjust the port and endpoint as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.user) {
        // Handle successful Login
        navigate("/scanner");
        console.log("Login successful");
      } else {
        setError("Invalid email or password."); // Incorrect credentials
      }
    } catch (error) {
      console.error("Error sending form data:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <Wrapper isOpen={true} onClose={onClose}>
      {" "}
      {/* Use Wrapper component */}
      {!showRegisterForm ? (
        <div>
          <h2>Login</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            {/* Login form inputs */}
            <div className="input-box">
              <span className="icon">
                <IonIcon icon="mail-sharp"></IonIcon>
              </span>
              <input
                id="email-login"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email-login">Email</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon="lock-closed"></IonIcon>
              </span>
              <input
                id="passwd-login"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="passwd-login">Password</label>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <div id="errorContainer">{error}</div>
          </form>
          <div className="login-register">
            <p>
              Don't have an account?
              <a href="#" onClick={() => setShowRegisterForm(true)}>
                Register
              </a>
            </p>
          </div>
        </div>
      ) : (
        <RegisterForm toggleLoginForm={() => setShowRegisterForm(false)} />
      )}
    </Wrapper>
  );
};

export default LoginForm;

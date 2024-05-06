import React, { useState } from "react";
import RegisterForm from "./RegisterForm";
import "./style.css";

const LoginForm = ({ toggleLoginForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Simulate login logic (replace with your actual login logic)
    if (email === "user@example.com" && password === "password") {
      alert("Login successful!");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div>
      {!showRegisterForm ? (
        <>
          <h2>Login</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            {/* Login form inputs */}
            <div className="input-box">
              <span className="icon">
                <ion-icon name="mail-sharp"></ion-icon>
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
                <ion-icon name="lock-closed-sharp"></ion-icon>
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
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Remember me
              </label>
              <a href="#">Forgot Password</a>
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
        </>
      ) : (
        <RegisterForm toggleLoginForm={() => setShowRegisterForm(false)} />
      )}
    </div>
  );
};

export default LoginForm;

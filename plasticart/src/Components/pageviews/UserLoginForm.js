import React, { useState } from "react";
import IonIcon from "./Icon";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { appAuth } from "../../config";
import styles from "./Start.module.css";

const UserLoginForm = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    signInWithEmailAndPassword(appAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("email", user.email);
        localStorage.setItem("username", user.displayName || user.email);
        navigate("/scanner", {
          state: {
            name: user.displayName || user.email,
            email: user.email,
          },
        });
      })
      .catch((error) => {
        setError("Unable to sign in. Please try again later...");
      });
  };

  return (
    <div className={styles.startAuthBox}>
      <h2>User Login</h2>
      <form id="loginForm" onSubmit={handleLogin}>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="mail-sharp" />
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
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="lock-closed" />
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
        {error && (
          <div id="errorContainer" className={styles.startError}>
            {error}
          </div>
        )}
        <button type="submit" className={styles.startAuthButton}>
          Login
        </button>
      </form>
    </div>
  );
};

export default UserLoginForm;

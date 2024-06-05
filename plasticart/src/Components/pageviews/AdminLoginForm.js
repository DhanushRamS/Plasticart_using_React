import React, { useState } from "react";
import IonIcon from "./Icon";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { appAuth } from "../../config";
import styles from "./Start.module.css";

const AdminLoginForm = ({ toggleForm, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(appAuth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("Login successful, user:", user);
          setErrorMessage("");
          onLogin(email); // Pass email to parent component
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        })
        .catch((error) => {
          setErrorMessage("Unable to sign in. Please try again later...");
        });
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.startFormWrapper}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="mail-sharp" />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="lock-closed" />
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit" className={styles.startAuthButton}>
          Login
        </button>
      </form>
      <p className={styles.startSwitchForm}>
        Don't have an account?{" "}
        <span onClick={toggleForm} className={styles.startSwitchLink}>
          Register
        </span>
      </p>
    </div>
  );
};

export default AdminLoginForm;

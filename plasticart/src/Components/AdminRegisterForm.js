import React, { useState } from "react";
import styles from "./AdminAuth.module.css";

const AdminRegisterForm = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful!");
        setErrorMessage("");
      } else {
        const data = await response.json();
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.adminAuthBox}>
      <h2>Admin Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.forlabel}>
            Username
          </label>
          <input
            className={styles.forinput}
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.forlabel}>
            Email
          </label>
          <input
            className={styles.forinput}
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.forlabel}>
            Password
          </label>
          <input
            className={styles.forinput}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.authButton}>
          Register
        </button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <p className={styles.toggleText}>
        Already have an account? <span onClick={toggleForm}>Login here</span>
      </p>
    </div>
  );
};

export default AdminRegisterForm;

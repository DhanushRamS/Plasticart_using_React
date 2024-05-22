import React, { useState } from "react";
import styles from "./VendorAuth.module.css";
import { useNavigate } from "react-router-dom";

const VendorLoginForm = ({ toggleForm, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle submit");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        fetch("http://localhost:5000/api/vendor/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, latitude, longitude }),
        })
          .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
              setSuccessMessage("Login successful!");
              setErrorMessage("");
              onLogin(email); // Pass email to parent component
              navigate("/dashboard", { state: data });
            } else {
              setErrorMessage("Something went wrong. Please try again.");
            }
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setErrorMessage(
          "Could not get location. Please enable location services."
        );
      }
    );
  };

  return (
    <div className={styles.vendorAuthBox}>
      <h2>Vendor Login</h2>
      <form onSubmit={handleSubmit}>
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
          Login
        </button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <p className={styles.toggleText}>
        Don't have an account? <span onClick={toggleForm}>Register here</span>
      </p>
    </div>
  );
};

export default VendorLoginForm;

import React, { useState } from "react";
import IonIcon from "./Icon";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { appAuth, appFirestore } from "../../config";
import { doc, setDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Start.module.css";

const VendorRegisterForm = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsConditions) {
      setErrorMessage("You have to agree to terms and conditions");
      return;
    }

    createUserWithEmailAndPassword(appAuth, email, password)
      .then(async (user) => {
        await setDoc(
          doc(appFirestore, "VENDOR", email),
          {
            name: username,
            email: email,
          },
          { merge: true }
        );
        navigate("/vendor-dashboard", {
          state: {
            name: user.name,
            email: user.email,
          },
        });
      })
      .catch((error) => {
        setErrorMessage("Unable to sign in... Try again later");
      });
  };

  return (
    <div className={styles.startFormWrapper}>
      <h2>Vendor Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="person" />
          </span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Username</label>
        </div>
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
            <IonIcon icon="lock-closed-sharp" />
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        <label className={styles.vendorStartTermsLabel}>
          <input
            type="checkbox"
            required
            onChange={(e) => setTermsConditions(e.target.checked)}
            className={styles.checkbox}
          />{" "}
          I agree to the terms & conditions
        </label>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button type="submit" className={styles.startAuthButton}>
          Register
        </button>
      </form>
      <p className={styles.startSwitchForm}>
        Already have an account?{" "}
        <span onClick={toggleForm} className={styles.startSwitchLink}>
          Login
        </span>
      </p>
    </div>
  );
};

export default VendorRegisterForm;

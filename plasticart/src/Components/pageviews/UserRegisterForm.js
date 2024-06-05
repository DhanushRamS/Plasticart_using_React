import React, { useState } from "react";
import IonIcon from "./Icon";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { appAuth, appFirestore } from "../../config";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Start.module.css";

const UserRegisterForm = ({ toggleForm }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (!termsConditions) {
      setError("You have to agree to terms and conditions");
      return;
    }

    createUserWithEmailAndPassword(appAuth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(
          doc(appFirestore, "USER", user.uid),
          {
            username: username,
            email: email,
            points: 0,
          },
          { merge: true }
        );
        navigate("/scanner", {
          state: {
            name: username,
            email: email,
          },
        });
      })
      .catch((error) => {
        setError("Unable to register. Please try again later...");
      });
  };

  return (
    <div className={styles.startAuthBox}>
      <h2>User Registration</h2>
      <form id="registerForm" onSubmit={handleRegisterSubmit}>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="person" />
          </span>
          <input
            id="username-register"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="username-register">Username</label>
        </div>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="mail-sharp" />
          </span>
          <input
            id="email-register"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email-register">Email</label>
        </div>
        <div className={styles.startInputBox}>
          <span className={styles.startUserIcon}>
            <IonIcon icon="lock-closed-sharp" />
          </span>
          <input
            id="passwd-register"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="passwd-register">Password</label>
        </div>
        <label className={styles.startTermsLabel}>
          <input
            type="checkbox"
            required
            onChange={(e) => setTermsConditions(e.target.checked)}
          />{" "}
          I agree to the terms & conditions
        </label>
        {error && <p className={styles.startError}>{error}</p>}
        <button type="submit" className={styles.startAuthButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default UserRegisterForm;

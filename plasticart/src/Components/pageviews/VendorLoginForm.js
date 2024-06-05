import React, { useState } from "react";
import IonIcon from "./Icon";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { appAuth, appFirestore } from "../../config";
import { doc, setDoc } from "firebase/firestore";
import styles from "./Start.module.css";

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
        signInWithEmailAndPassword(appAuth, email, password)
          .then(async (user) => {
            console.log(user);
            setSuccessMessage("Login successful!");
            setErrorMessage("");
            onLogin(email);
            await setDoc(
              doc(appFirestore, "VENDOR", email),
              {
                latitude: latitude,
                longitude: longitude,
              },
              { merge: true }
            );
            navigate("/vendor-dashboard", {
              state: {
                name: user.displayName,
                email: email,
                status: "ok",
                token: user.uid,
              },
            });
          })
          .catch((error) => {
            setErrorMessage("Unable to sign in. Please try again later...");
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
    <div className={styles.startFormWrapper}>
      <h2>Vendor Login</h2>
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
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <p className={styles.startSwitchForm}>
        Don't have an account?{" "}
        <span onClick={toggleForm} className={styles.startSwitchLink}>
          Register
        </span>
      </p>
    </div>
  );
};

export default VendorLoginForm;

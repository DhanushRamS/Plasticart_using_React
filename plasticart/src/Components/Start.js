import React from "react";
import styles from "./Start.module.css";

const Start = () => {
  const handleLoginUser = () => {
    window.location.href = "http://localhost:3000/Userhome";
  };

  const handleLoginVendor = () => {
    window.location.href = "http://localhost:3000/vendor-auth";
  };

  const handleLoginAdmin = () => {
    window.location.href = "http://localhost:3000/admin-auth";
  };

  return (
    <div className={styles.startdiv}>
      <div className={styles.wel}>
        <h1>Welcome to PlastiCart</h1>
      </div>
      <ul className={styles.startul}>
        <li className={styles.startli}>
          <button
            className={styles.startbtnLoginpopup}
            onClick={handleLoginUser}
          >
            Login as User
          </button>
        </li>
        <li className={styles.startli}>
          <button
            className={styles.startbtnLoginpopup}
            onClick={handleLoginVendor}
          >
            Login as Vendor
          </button>
        </li>
        <li className={styles.startli}>
          <button
            className={styles.startbtnLoginpopup}
            onClick={handleLoginAdmin}
          >
            Login as Admin
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Start;

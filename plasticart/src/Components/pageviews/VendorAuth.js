import React, { useState } from "react";
import VendorLoginForm from "./VendorLoginForm";
import VendorRegisterForm from "./VendorRegisterForm";
import styles from "./Start.module.css";

const VendorAuth = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className={styles.startFormContainer}>
      <button className={styles.startCloseButton} onClick={onClose}>
        ×
      </button>
      <div className={styles.startFormWrapper}>
        {isLogin ? (
          <VendorLoginForm toggleForm={toggleForm} onLogin={onLogin} />
        ) : (
          <VendorRegisterForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default VendorAuth;

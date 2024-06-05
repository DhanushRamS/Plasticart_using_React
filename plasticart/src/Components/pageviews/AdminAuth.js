import React, { useState } from "react";
import AdminLoginForm from "./AdminLoginForm";
import AdminRegisterForm from "./AdminRegisterForm";
import styles from "./Start.module.css";

const AdminAuth = ({ onClose, onLogin }) => {
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
          <AdminLoginForm toggleForm={toggleForm} onLogin={onLogin} />
        ) : (
          <AdminRegisterForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default AdminAuth;

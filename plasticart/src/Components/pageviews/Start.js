import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Start.module.css";
import UserLoginForm from "./UserLoginForm";
import UserRegisterForm from "./UserRegisterForm";
import VendorAuth from "./VendorAuth";
import AdminAuth from "./AdminAuth";

const Start = () => {
  const [showForms, setShowForms] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isVendorForm, setIsVendorForm] = useState(false);
  const [isAdminForm, setIsAdminForm] = useState(false);
  const navigate = useNavigate();

  const handleLoginUser = () => {
    setShowForms(true);
    setIsLoginForm(true);
    setIsVendorForm(false);
    setIsAdminForm(false);
  };

  const handleRegisterUser = () => {
    setShowForms(true);
    setIsLoginForm(false);
    setIsVendorForm(false);
    setIsAdminForm(false);
  };

  const handleLoginVendor = () => {
    setShowForms(true);
    setIsVendorForm(true);
    setIsAdminForm(false);
  };

  const handleLoginAdmin = () => {
    setShowForms(true);
    setIsLoginForm(false);
    setIsVendorForm(false);
    setIsAdminForm(true);
  };

  const handleCloseForms = () => {
    setShowForms(false);
    setIsVendorForm(false);
    setIsAdminForm(false);
  };

  return (
    <div
      className={`startHScreen startFlex startFlexCol startJustifyCenter startItemsCenter ${styles.startContainer}`}
    >
      <div className={styles.backgroundAnimations}>
        <div className={`${styles.animatedCircle} ${styles.circle1}`}></div>
        <div className={`${styles.animatedCircle} ${styles.circle2}`}></div>
        <div className={`${styles.animatedCircle} ${styles.circle3}`}></div>
      </div>
      {!showForms ? (
        <>
          <div
            className={`${styles.startWelcome} animate__animated animate__fadeInDown`}
          >
            <h1>Welcome to PlastiCart</h1>
            <p>Your one-stop solution for recycling</p>
          </div>
          <ul
            className={`${styles.startUl} animate__animated animate__fadeInUp`}
          >
            <li className={styles.startLi}>
              <button
                className={styles.startBtnLoginPopup}
                onClick={handleLoginUser}
              >
                Login as User
              </button>
            </li>
            <li className={styles.startLi}>
              <button
                className={styles.startBtnLoginPopup}
                onClick={handleLoginVendor}
              >
                Login as Vendor
              </button>
            </li>
            <li className={styles.startLi}>
              <button
                className={styles.startBtnLoginPopup}
                onClick={handleLoginAdmin}
              >
                Login as Admin
              </button>
            </li>
          </ul>
        </>
      ) : isVendorForm ? (
        <VendorAuth onClose={handleCloseForms} onLogin={handleCloseForms} />
      ) : isAdminForm ? (
        <AdminAuth onClose={handleCloseForms} onLogin={handleCloseForms} />
      ) : (
        <div
          className={`${styles.startFormContainer} animate__animated animate__fadeInUp`}
        >
          <button
            className={styles.startCloseButton}
            onClick={handleCloseForms}
          >
            ×
          </button>
          <div className={styles.startFormWrapper}>
            {isLoginForm ? <UserLoginForm /> : <UserRegisterForm />}
            <div className={styles.startSwitchForm}>
              {isLoginForm ? (
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={handleRegisterUser}
                    className={styles.startSwitchLink}
                  >
                    Register
                  </span>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={handleLoginUser}
                    className={styles.startSwitchLink}
                  >
                    Login
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;

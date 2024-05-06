// Wrapper.js
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./style.css"; // Assuming your wrapper styles are in this file

const Wrapper = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(isOpen);

  // Function to toggle between login and register forms
  const toggleLoginForm = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`wrapper ${isActive ? "active" : ""}`} onClick={onClose}>
      {isActive ? (
        <div className="form-box login">
          <LoginForm toggleLoginForm={toggleLoginForm} />
        </div>
      ) : (
        <div className="form-box register">
          <RegisterForm toggleLoginForm={toggleLoginForm} />
        </div>
      )}
    </div>
  );
};

export default Wrapper;

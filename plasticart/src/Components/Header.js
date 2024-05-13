//Header.js
import React, { useState } from "react";
// import "./style.css";
import LoginForm from "./LoginForm";

const Header = () => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

  const openLoginForm = () => {
    setIsLoginFormOpen(true);
  };

  const closeLoginForm = () => {
    setIsLoginFormOpen(false);
  };

  return (
    <>
      <header>
        <h2 className="logo">PlastiCart</h2>
        <nav>
          <ul className="navigation">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <button className="btnLogin-popup" onClick={openLoginForm}>
                Login
              </button>
            </li>
            <li className="hamburger">
              <a href="#">
                <div className="bar"></div>
              </a>
            </li>
          </ul>
        </nav>
      </header>
      {isLoginFormOpen && <LoginForm onClose={closeLoginForm} />}
    </>
  );
};

export default Header;

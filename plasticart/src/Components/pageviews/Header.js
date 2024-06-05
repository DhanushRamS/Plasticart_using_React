//Header.js
import React from "react";
// import "./style.css";
import styles from "./Vendor.module.css";

const Header = () => {

  return (
    <>
      <header
        className={`${styles.header} flex justify-between items-center w-full !p-3`}
      >
        <h2 className={`${styles.logo} font-bold text-3xl`}>PlastiCart</h2>
        <nav className="">
          <ul className={styles.navigation}>
            <li className="hidden lg:block">
              <a href="#">Home</a>
            </li>
            <li className="hidden lg:block">
              <a href="#about">About</a>
            </li>
            <li className="hidden lg:block mr-4">
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;

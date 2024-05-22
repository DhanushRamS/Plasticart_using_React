import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Vendor.module.css";

const VendorNav = () => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens or any other logout operations
    localStorage.removeItem("token"); // Adjust this based on your auth token key
    navigate("/vendor-auth");
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>PlastiCart</h2>
      <nav>
        <ul className={styles.navigation}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <Link className="link" onClick={() => setOpenDropdown(false)}>
              Profile
            </Link>
          </li>
          <li className={styles.hamburger}>
            <a href="#" onClick={() => setOpenDropdown(!openDropdown)}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </a>
            {openDropdown && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default VendorNav;

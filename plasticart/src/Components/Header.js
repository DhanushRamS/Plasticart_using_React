// // Header.js
// import React, { useState } from "react";
// import "./style.css";
// import Wrapper from "./Wrapper";

// const Header = () => {
//   const [isWrapperOpen, setIsWrapperOpen] = useState(false);

//   // Function to handle click on login button in navbar
//   const handleLoginClick = () => {
//     setIsWrapperOpen(!isWrapperOpen); // Toggle the state to open/close the wrapper
//   };

//   return (
//     <>
//       <header>
//         <h2 className="logo">PlastiCart</h2>
//         <nav>
//           <ul className="navigation">
//             <li>
//               <a href="#">Home</a>
//             </li>
//             <li>
//               <a href="#about">About</a>
//             </li>
//             <li>
//               <a href="#">Contact Us</a>
//             </li>
//             <li>
//               <button className="btnLogin-popup" onClick={handleLoginClick}>
//                 Login
//               </button>
//             </li>
//             <li className="hamburger">
//               <a href="#">
//                 <div className="bar"></div>
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </header>
//       {isWrapperOpen && (
//         <Wrapper isOpen={isWrapperOpen} onClose={handleLoginClick} />
//       )}
//     </>
//   );
// };

// export default Header;

// Header.js
import React, { useState } from "react";
import "./style.css";
import Wrapper from "./Wrapper";

const Header = () => {
  const [isWrapperOpen, setIsWrapperOpen] = useState(false);

  // Function to handle click on login button in navbar
  const handleLoginClick = () => {
    setIsWrapperOpen(!isWrapperOpen); // Toggle the state to open/close the wrapper
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
              <button className="btnLogin-popup" onClick={handleLoginClick}>
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
      {isWrapperOpen && (
        <Wrapper isOpen={isWrapperOpen} onClose={handleLoginClick} />
      )}
    </>
  );
};

export default Header;

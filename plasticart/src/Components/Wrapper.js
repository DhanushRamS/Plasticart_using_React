// //Wrapper.js

// import React from "react";
// // import "./style.css";

// const Wrapper = ({ children, isOpen, onClose, setIsWrapperOpen }) => {
//   const handleWrapperClick = (event) => {
//     // Prevent closing if a click occurs inside the form
//     event.stopPropagation();
//   };
//   const handleCloseWrapper = () => {
//     onClose(); // Call onClose when the close icon is clicked
//     setIsWrapperOpen(false);
//   };

//   return (
//     <div
//       className={`wrapper ${isOpen ? "active-popup" : ""}`}
//       onClick={(event) => {
//         // Check if the click occurred outside the form box
//         if (!event.target.closest(".form-box")) {
//           onClose();
//           setIsWrapperOpen(false);
//         }
//       }}
//     >
//       <div className="form-box" onClick={handleWrapperClick}>
//         <span className="icon-close" onClick={handleCloseWrapper}>
//           &times;
//         </span>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Wrapper;

import React from "react";

const Wrapper = ({ children, isOpen, onClose }) => {
  const handleWrapperClick = (event) => {
    // Prevent closing if a click occurs inside the form
    event.stopPropagation();
  };

  const handleCloseWrapper = () => {
    onClose(); // Call onClose when the close icon is clicked
  };

  return (
    <div
      className={`wrapper ${isOpen ? "active-popup" : ""}`}
      onClick={(event) => {
        // Check if the click occurred outside the form box
        if (!event.target.closest(".form-box")) {
          onClose();
        }
      }}
    >
      <div className="form-box" onClick={handleWrapperClick}>
        <span className="icon-close" onClick={handleCloseWrapper}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Wrapper;

// import React, { useState } from "react";
// import Header from "./Components/Header";
// import Main from "./Components/Main";
// import Wrapper from "./Components/Wrapper";
// import LoginForm from "./Components/LoginForm";
// import RegisterForm from "./Components/RegisterForm";
// import AboutUs from "./Components/AboutUs";
// import "./App.css";
// import "./style.css";

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [showRegisterForm, setShowRegisterForm] = useState(false);

//   const handleLoginClick = () => {
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   return (
//     <div className="App">
//       <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
//       <Main />
//       <Wrapper>
//         {showRegisterForm ? (
//           <RegisterForm toggleLoginForm={() => setShowRegisterForm(false)} />
//         ) : (
//           <LoginForm toggleRegisterForm={() => setShowRegisterForm(true)} />
//         )}
//       </Wrapper>
//       <AboutUs />
//     </div>
//   );
// };

// export default App;

import React, { useState } from "react";
import Header from "./Components/Header";
import Main from "./Components/Main";
import Wrapper from "./Components/Wrapper";
import LoginForm from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import AboutUs from "./Components/AboutUs";
import "./App.css";
import "./style.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isWrapperOpen, setIsWrapperOpen] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Function to handle click on login button in header
  const handleLoginClick = () => {
    setIsWrapperOpen(!isWrapperOpen); // Toggle the state to open/close the wrapper
  };

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={handleLoginClick}
      />
      <Main />
      <Wrapper isOpen={isWrapperOpen} onClose={handleLoginClick}>
        {showRegisterForm ? (
          <RegisterForm toggleLoginForm={() => setShowRegisterForm(false)} />
        ) : (
          <LoginForm toggleRegisterForm={() => setShowRegisterForm(true)} />
        )}
      </Wrapper>
      <AboutUs />
    </div>
  );
};

export default App;

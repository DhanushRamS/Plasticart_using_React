// // import React, { useState } from "react";
// // import Header from "./Components/Header";
// // import Main from "./Components/Main";
// // import Wrapper from "./Components/Wrapper";
// // import LoginForm from "./Components/LoginForm";
// // import RegisterForm from "./Components/RegisterForm";
// // import AboutUs from "./Components/AboutUs";
// // import "./App.css";
// // import "./style.css";

// // const App = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [showRegisterForm, setShowRegisterForm] = useState(false);

// //   const handleLogin = () => {
// //     setIsLoggedIn(true);
// //   };

// //   const handleLogout = () => {
// //     setIsLoggedIn(false);
// //   };

// //   return (
// //     <div className="App">
// //       <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
// //       <Main />
// //       <Wrapper>
// //         {showRegisterForm ? (
// //           <RegisterForm toggleLoginForm={() => setShowRegisterForm(true)} />
// //         ) : (
// //           <LoginForm toggleRegisterForm={() => setShowRegisterForm(true)} />
// //         )}
// //       </Wrapper>
// //       <AboutUs />
// //     </div>
// //   );
// // };

// // export default App;

// //App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Scanner from "./Components/Scanner";
import Start from "./Components/Start";
// import "./App.css";
import "./style.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/Userhome" element={<Home />} />
        <Route path="/scanner" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Redirect,
//   useHistory,
// } from "react-router-dom"; // Import useHistory along with BrowserRouter, Route, Switch, and Redirect
// import Header from "./Components/Header";
// import Main from "./Components/Main";
// import Wrapper from "./Components/Wrapper";
// import LoginForm from "./Components/LoginForm";
// import RegisterForm from "./Components/RegisterForm";
// import AboutUs from "./Components/AboutUs";
// import Popup from "./Components/Popup";
// import Scanner from "./Components/Scanner"; // Import the Scanner component
// import Icon from "./Components/Icon";
// import "./App.css";
// import "./style.css";

// const App = () => {
//   const history = useHistory(); // Initialize useHistory

//   const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
//   const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
//   const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

//   const openLoginForm = () => {
//     setIsLoginFormOpen(true);
//     setIsRegisterFormOpen(false); // Close the register form
//   };

//   const closeLoginForm = () => {
//     setIsLoginFormOpen(false);
//   };

//   const openRegisterForm = () => {
//     setIsRegisterFormOpen(true);
//   };

//   const closeRegisterForm = () => {
//     setIsRegisterFormOpen(false);
//   };

//   const openAboutUs = () => {
//     setIsAboutUsOpen(true);
//   };

//   const closeAboutUs = () => {
//     setIsAboutUsOpen(false);
//   };

//   return (
//     <Router>
//       <div>
//         <Header
//           openLoginForm={openLoginForm}
//           openRegisterForm={openRegisterForm}
//           openAboutUs={openAboutUs}
//         />
//         <Main />
//         <Popup />
//         <Switch>
//           <Route path="/" exact>
//             <Wrapper
//               isOpen={isLoginFormOpen || isRegisterFormOpen}
//               onClose={() => {
//                 closeLoginForm();
//                 closeRegisterForm();
//               }}
//             >
//               {isLoginFormOpen && <LoginForm onClose={closeLoginForm} />}
//               {isRegisterFormOpen && (
//                 <RegisterForm onClose={closeRegisterForm} />
//               )}
//             </Wrapper>
//           </Route>
//           <Route path="/scanner" exact>
//             <Scanner />
//           </Route>
//           <Route path="/about-us" exact>
//             <AboutUs isOpen={isAboutUsOpen} onClose={closeAboutUs} />
//           </Route>
//           <Redirect to="/" />
//         </Switch>
//       </div>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from "react";
import Header from "./Header";
import Main from "./Main";
import AboutUs from "./AboutUs";
import Popup from "./Popup";
import "./style.css";

const Home = () => {
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

  const openAboutUs = () => {
    setIsAboutUsOpen(true);
  };

  const closeAboutUs = () => {
    setIsAboutUsOpen(false);
  };

  return (
    <div>
      <Header
        openAboutUs={openAboutUs}
      />
      <Main />
      <Popup />
      <AboutUs isOpen={isAboutUsOpen} onClose={closeAboutUs} />
    </div>
  );
};

export default Home;

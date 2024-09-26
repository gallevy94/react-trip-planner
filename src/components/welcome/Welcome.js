import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css"; 

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/dologin");
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to Trip Planner</h1>
      <p className="p_welcome">Plan your dream trip with ease. Sign in or sign up to get started!</p>
      <button className="get-started-btn" onClick={handleGetStarted}>
        Get Started
      </button>
    </div>
  );
};

export default Welcome;

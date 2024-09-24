import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import "./Navbar.css";

const Navbar = ({
  isLogin,
  setIsLogin,
  setIsSignup,
  setChatData,
  setCoordinates,
  setImagesUrls,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout
    localStorage.removeItem("UserId");
    setIsLogin(false);
    navigate("/dologin");
  };

  return (
    <div className="nav_container">
      <img className="nav_logo" src={Logo} alt="Logo" />

      <ul className="nav_menu">
        {isLogin ? (
          <>
            <div className="maps_menu">
              <button
                className="button"
                onClick={() => {
                  setChatData("");
                  setCoordinates("");
                  setImagesUrls("");
                  navigate("/map");
                }}
              >
                Plan A Trip
              </button>
              <button
                className="button"
                onClick={() => {
                  navigate("/mytrips");
                }}
              >
                My Trips
              </button>
            </div>
            <button className="nav_button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav_button"
              onClick={() => {
                setIsSignup(false);
                navigate("/dologin");
              }}
            >
              Login
            </button>
            <button
              className="nav_button"
              onClick={() => {
                setIsSignup(true);
              }}
            >
              SignUp
            </button>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;

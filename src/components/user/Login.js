import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createApi } from "../../api";
import googleLogo from "../../assets/google_logo.png";

import "./Login.css";

const Login = ({ setIsLogin, isSignup, setUserId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLogin, setIsGoogleLogin] = useState(false); // New state for Google login

  const api = createApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLogin(false);
    const query = new URLSearchParams(location.search);
    let token = query.get("token");
    
    if (!token) {
      token = localStorage.getItem("token"); // Fallback to localStorage
    }

    if (token) {
      let id = query.get("id");
      localStorage.setItem("token", token);
      setUserId(id);
      setError(""); 
      setIsLogin(true);
      setIsGoogleLogin(false); 
      navigate("/map");
    }
  }, [location, setIsLogin, navigate, setUserId]);

  const googleLogin = () => {
    setError(""); 
    setIsGoogleLogin(true); 
    window.location.href =
      "http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:8080/google";
  };

  const submit = async (e) => {
    e.preventDefault();

    if (username && password) {
      try {
        let data;
        if (isSignup) {
          data = await api.createUser(username, password);
        } else {
          data = await api.getToken(username, password);
        }

        localStorage.setItem("token", data.token);
        setUserId(data.userId);
        setIsLogin(true);
        navigate("/map");
      } catch (error) {
        setError("Invalid credentials");
        setIsLogin(false);
      }
    } else {
      setError("Please Fill All Fields");
    }
  };

  return (
    <div className="login_container">
      <form className="login_form" onSubmit={submit}>
        {isSignup && <h3>Create Account</h3>}
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button">{isSignup ? "SignUp" : "Login"}</button>
        {/* Only show the error if it's not a Google login */}
        {error && !isGoogleLogin && <p className="error_p">{error}</p>}
        
        <div className="divider-wrapper">
          <span className="divider">Or</span>
        </div>

        <button className="google-button" type="button" onClick={googleLogin}>
          <img src={googleLogo} alt="Google logo" className="google-logo" />
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;

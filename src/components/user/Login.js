import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createApi } from "../../api";
import googleLogo from "../../assets/google_logo.png";

import "./Login.css";

const Login = ({ setIsLogin, isSignup, setUserId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const api = createApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLogin(false);
    // Check if the URL contains the token after Google login
    const query = new URLSearchParams(location.search);
    let token = query.get("token");
    console.log(token);

    if (!token) {
      token = localStorage.getItem("token"); // Fallback to localStorage
      console.log(token);
    }

    if (token) {
      let id = query.get("id");
      localStorage.setItem("token", token);
      console.log(token);
      setUserId(id);
      setIsLogin(true);
      navigate("/map");
    }
  }, [location, setIsLogin, navigate]);

  const googleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorize/google?redirect_uri=http://localhost:8080/google";

    setTimeout(() => {
      setIsLogin(true);
    }, 2000);
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
        console.log(data.userId);
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

  const decodeJWT = (token) => {
    const base64Url = token.split(".")[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Replace URL-safe characters
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
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
        {error && <p className="error_p">{error}</p>}
        <div className="divider-wrapper">
          <span className="divider">Or</span>
        </div>

        <button className="google-button" onClick={googleLogin}>
          <img src={googleLogo} alt="Google logo" className="google-logo" />
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

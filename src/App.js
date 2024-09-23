import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import MapContainer from "./components/map/MapContainer";
import TripInput from "./components/search/TripInput";
import Loader from "./components/loader/Loader";
import Login from "./components/user/Login";

import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import { useLoadScript } from "@react-google-maps/api";
import MyTrips from "./components/trip/MyTrips";

const libraries = ["places"];

function App() {
  const [userId, setUserId] = useState(0);
  const [chatData, setChatData] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const [imagesUrls, setImagesUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAASPD-LcNHdzx6pcU3taWxY-i-AwRiEWo",
    libraries,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token); // Set isLogin to true if the token is present
  }, []);

  if (!isLoaded) return <Loader />;

  return (
    <Router>
      <div className="App">
        <Navbar
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setIsSignup={setIsSignup}
          setChatData={setChatData}
          setCoordinates={setCoordinates}
          setImagesUrls={setImagesUrls}
        />
        <Routes>
          <Route
            path="/dologin"
            element={
              <Login
                setIsLogin={setIsLogin}
                isSignup={isSignup}
                setUserId={setUserId}
              />
            }
          />

          <Route
            path="/mytrips"
            element={
              <MyTrips
                userId={userId}
                setChatData={setChatData}
                setCoordinates={setCoordinates}
                setImagesUrls={setImagesUrls}
              />
            }
          />
          <Route
            path="/map"
            element={
              isLogin ? (
                <>
                  <TripInput
                    userId={userId}
                    setChatData={setChatData}
                    setCoordinates={setCoordinates}
                    setImagesUrls={setImagesUrls}
                    setIsLoading={setIsLoading}
                  />
                  <MapContainer
                    tripPlan={chatData}
                    coordinates={coordinates}
                    imagesUrls={imagesUrls}
                  />
                </>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        {isLoading && <Loader />}
      </div>
    </Router>
  );
}

export default App;

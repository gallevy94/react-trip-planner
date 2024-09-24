import React, { useEffect, useState } from "react";
import { createApi } from "../../api";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import "./MyTrips.css";

const MyTrips = ({ userId, setChatData, setCoordinates, setImagesUrls }) => {
  const api = createApi();
  const navigate = useNavigate();
  const [trips, setTrips] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await api.getUserTrips(userId);
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips", error);
      }
    };

    fetchTrips();
  }, [userId, api]);

  const handleTripClick = (id) => {
    const clickedTrip = trips.find((trip) => trip.id === id);
    const jsonTripPlan = JSON.parse(clickedTrip.tripPlan);

    setChatData(jsonTripPlan);
    setCoordinates(clickedTrip.coordinates);
    setImagesUrls(clickedTrip.imagesUrls);

    navigate("/map");
  };

  return (
    <div className="mytrips_container">
      {trips ? (
        trips.map((trip, key) => (
          <button
            key={trip.id}
            className="mytrip_container"
            onClick={() => handleTripClick(trip.id)}
          >
            <h2>
              {trip.cityName}
              <div className="mytrips_date">
                {" "}
                {trip.startDate} - {trip.endDate}
              </div>
            </h2>
            <img
              src={trip.imagesUrls[0]}
              alt="city-image"
              style={{ width: "400px", height: "300px" }}
            />
          </button>
        ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default MyTrips;

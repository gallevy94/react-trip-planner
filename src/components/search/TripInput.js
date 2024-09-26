import "./TripInput.css";
import React, { useState, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { createApi } from "../../api";

const TripInput = ({
  userId,
  setChatData,
  setCoordinates,
  setImagesUrls,
  setIsLoading,
}) => {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const autocompleteRef = useRef(null);
  const api = createApi();

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setLocation(place.formatted_address);
  };

  const submitUserInput = async (e) => {
    e.preventDefault();

    if (location && startDate && endDate) {
      setIsLoading(true);

      try {
        const data = await api.getTripPlan(location, startDate, endDate, userId);
        if (data) {
          const { tripPlan, coordinates, imagesUrls } = data;

          const tripPlanArray = JSON.parse(tripPlan);
          setChatData(tripPlanArray);
          setCoordinates(coordinates);
          setImagesUrls(imagesUrls);
        } else {
          console.error("No data returned from API");
        }
      } catch (error) {
        console.error("Error fetching trip plan:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section id="trip_input" className="main_input_container">
      <div className="user_input">
        <form className="input_form" onSubmit={submitUserInput}>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              className="input"
              type="text"
              placeholder="City Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Autocomplete>

          <input
            className="input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            className="input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="button">Generate Trip</button>
        </form>
      </div>
    </section>
  );
};

export default TripInput;

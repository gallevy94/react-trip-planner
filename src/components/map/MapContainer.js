import "./MapContainer.css";
import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Days from "../trip/Days";
import Activity from "../trip/Activity";
import NormalPinIcon from "../../assets/normal_pin.png";
import SelectedPinIcon from "../../assets/selected_pin.png";
import Slider from "react-slick";
import Draggable from "react-draggable";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const defaultCenter = {
  lat: 32.109333,
  lng: 34.855499,
};

const MapContainer = ({ tripPlan, coordinates, imagesUrls }) => {
  const [allMarkers, setAllMarkers] = useState([]);
  const [dayMarkers, setDayMarkers] = useState([]);
  const [directions, setDirections] = useState(null);
  const [cardIdClick, setCardIdClick] = useState(null);
  const [dayIdClick, setDayIdClick] = useState(null);

  const nodeRef = useRef(null);
  const mapRef = useRef(null);
  const map = mapRef.current;

  const onDayPress = async (id) => {
    setDayIdClick(id);
    map.setZoom(13);

    //create ans set markers per day
    const markersForDay = coordinates[id].map((location, index) => ({
      id: index,
      lat: location.lat,
      lng: location.lng,
    }));
    setDayMarkers(markersForDay);
    mapRef.current.panTo({
      lat: markersForDay[0].lat,
      lng: markersForDay[0].lng,
    });
    mapRef.current.setZoom(13);

    //directions
    if (markersForDay.length > 1) {
      const origin = markersForDay[0]; // First marker
      const destination = markersForDay[markersForDay.length - 1]; // Last marker
      const waypoints = markersForDay.slice(1, -1).map((marker) => ({
        location: { lat: marker.lat, lng: marker.lng },
        stopover: true,
      }));

      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      if (results.status === "OK") {
        setDirections(results);
      }
    }
  };

  const onActivityPress = (id) => {
    setCardIdClick(id);
    const selectedLocation = allMarkers.find((location) => location.id === id);

    if (selectedLocation && mapRef.current) {
      map.panTo({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      map.setZoom(17);
    }
  };

  useEffect(() => {
    if (coordinates.length) {
      let uniqueId = 0;
      const flatMarkers = coordinates.flatMap((day) =>
        day.map((location, key) => ({
          id: uniqueId++,
          lat: location.lat || 0,
          lng: location.lng || 0,
        }))
      );
      setAllMarkers(flatMarkers);
      setDayMarkers(flatMarkers); // Initially show all markers
    }
  }, [coordinates]);

  return (
    <div className="map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={allMarkers.length ? allMarkers[0] : defaultCenter}
        onLoad={(map) => (mapRef.current = map)}
      >
        {dayMarkers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker}
            onClick={() => onActivityPress(marker.id)}
            icon={{
              url: cardIdClick === marker.id ? SelectedPinIcon : NormalPinIcon,
              scaledSize: new window.google.maps.Size(20, 30),
            }}
          />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      {tripPlan && <Days tripPlan={tripPlan} onItemClick={onDayPress} />}

      {dayIdClick !== null && tripPlan[dayIdClick] && (
        <Draggable nodeRef={nodeRef}>
          <div className="activity_slider" ref={nodeRef}>
            <Slider {...settings}>
              {tripPlan[dayIdClick].activities.map((activity) => (
                <div key={activity.id}>
                  <Activity
                    id={activity.id}
                    imageUrl={imagesUrls[activity.id + 1]}
                    place={activity.place}
                    time={activity.time}
                    address={activity.address}
                    description={activity.description}
                    onCardPress={onActivityPress}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default MapContainer;

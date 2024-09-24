import "./Activity.css";
import React from "react";
import PinIcon from "../../assets/pin.png";


const Activity = ({
  id,
  imageUrl,
  place,
  time,
  address,
  description,
  onCardPress,
  cardIdClick,
}) => {
  return (
      <div className="plan_container" onClick={() => onCardPress(id)}>
        <div className="time_label">{time}</div>

        <div className="content_container">
          <div className="img_container">
            <img src={imageUrl} alt="city-image" className="activity_image" />
          </div>

          <div className="details_container">
            <div className="place_container">
              <span className="place_name">{place}</span>
            </div>
            <h5 className="place_description">{description}</h5>

            <div className="address_container">
              <img className="pin_icon" src={PinIcon} alt="pin-icon" />
              <span className="place_address">{address}</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Activity;

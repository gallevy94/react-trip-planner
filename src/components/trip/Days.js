import React, { useState , useRef} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Days.css";
import Draggable from "react-draggable";
import DateLogo from "../../assets/date.png";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const Days = ({ tripPlan, onItemClick }) => {

  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef}>
      <div className="day_slider" ref={nodeRef}>
        <Slider {...settings}>
          {tripPlan.map((dayPlan, index) => (
            <div key={index} onClick={() => onItemClick(dayPlan.id)}>
              <div className="date_container">
                <img className="date_logo" src={DateLogo} alt="date_Logo" />
                <h3>{dayPlan.date}</h3>
              </div>
              <p className="data_summary">{dayPlan.summary}</p>
            </div>
          ))}
        </Slider>
      </div>
    </Draggable>
  );
};

export default Days;

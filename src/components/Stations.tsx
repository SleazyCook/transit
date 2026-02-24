import { useState } from "react";

// external
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import { FaTrain } from "react-icons/fa6";
import { MdOutlinePedalBike } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

import redline_stations from "../data/redline";
import greenline_stations from "../data/greenline";
import purpleline_stations from "../data/purpleline";

type Line = "Red" | "Green" | "Purple";

const Stations = () => {
  const [currentLine, setCurrentLine] = useState<Line>("Red");
  const [activeStationIndex, setActiveStationIndex] = useState<number | null>(null);

  // Decide which stations to show based on current line
  const stations =
    currentLine === "Red"
      ? redline_stations
      : currentLine === "Green"
      ? greenline_stations
      : purpleline_stations;

  return (
    <div className="transit-line">
      <div id="content">
        <h1>{currentLine} Line Stations</h1>

        <div className="transit-line--btn-box">
          <button className="transit-line--btn transit-line--btn-red" onClick={() => setCurrentLine("Red")}>Red</button>
          <button className="transit-line--btn transit-line--btn-green" onClick={() => setCurrentLine("Green")}>Green</button>
          <button className="transit-line--btn transit-line--btn-purple" onClick={() => setCurrentLine("Purple")}>Purple</button>
        </div>

        <ul className={`stations stations--${currentLine.toLowerCase()}`}>
          {stations.map((station, index) => {
            const isActive = activeStationIndex === index;
            return(
              <li key={index} className={`stop ${isActive ? "active" : ""}`}>
                <h3
                  onClick={() => 
                    setActiveStationIndex(isActive ? null : index)
                  }
                  style={{ cursor: "pointer" }}
                  >
                    {station.name}
                    <span className={`chevron ${isActive ? "rotate" : ""}`}><MdOutlineKeyboardArrowDown /></span>
                </h3>
                  <div className="station-details">
                    {station.address && (<p className="station-detail"><span><LuMapPin /></span><a href={station.address} target="_blank">View on Map</a></p>)}
                    {station.connections && <p className="station-detail"><span><FaTrain /></span>
                      Connections:{" "}
                      {Array.isArray(station.connections)
                        ? station.connections.join(", ")
                        : station.connections}
                    </p>}
                    {station.bike_parking && (<p className="station-detail"><span><MdOutlinePedalBike /></span>Bike Parking Available</p>)}
                    {station.nearby && (
                      <div className="station-nearby">
                        <p className="station-detail nearby-title">
                          <FaPersonWalking className="detail-icon" />
                            Popular Destinations
                        </p>
                        <ul>
                        {station.nearby?.map((spot, index) => (
                          <li key={index} className="station-detail nearby-item">
                            {spot}
                          </li>
                        ))}
                        </ul>
                      </div>
                    )}
                  </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Stations;
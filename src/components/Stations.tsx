import { useState } from "react";

// external
import { LuMapPin } from "react-icons/lu";
import { FaTrain } from "react-icons/fa6";
import { MdOutlinePedalBike } from "react-icons/md";
import { FaPersonWalking } from "react-icons/fa6";

import redline_stations from "../data/redline";
import greenline_stations from "../data/greenline";
import purpleline_stations from "../data/purpleline";
// import StationSelector from "./StationSelection";

type Line = "Red" | "Green" | "Purple";

const Stations = () => {
  const [currentLine, setCurrentLine] = useState<Line>("Red");
  const [showNorthStations, setShowNorthStations] = useState(false);

  // Decide which stations to show based on current line
  const allStations =
    currentLine === "Red"
      ? redline_stations
      : currentLine === "Green"
      ? greenline_stations
      : purpleline_stations;

  const stations = 
    currentLine === "Red" && !showNorthStations
      ? allStations.slice(6)
      : allStations;

  return (
    <div className="transit-line">
        <h1>{currentLine} Line Stations</h1>

        <div className="transit-line--btn-box">
          <button className="transit-line--btn transit-line--btn-red" onClick={() => setCurrentLine("Red")}>Red</button>
          <button className="transit-line--btn transit-line--btn-green" onClick={() => { setCurrentLine("Green"); setShowNorthStations(false); }}>Green</button>
          <button className="transit-line--btn transit-line--btn-purple" onClick={() => { setCurrentLine("Purple"); setShowNorthStations(false); }}>Purple</button>
        </div>

        {/* <StationSelector /> */}

        {/* Stations Map */}
        <ul className={`
          stations 
          stations--${currentLine.toLowerCase()}
          ${currentLine === "Red" && !showNorthStations ? "stations--view-more" : ""}`}>

        {/* View More -- RED LINE ONLY */}
        {(currentLine === "Red" && !showNorthStations ) && 
          (<>
            <div className="view-north-btn--container">
              <button 
                className="view-north-btn"
                id="btn--18"
                onClick={() => {
                  setShowNorthStations(prev => !prev);
                }}
              >
                {showNorthStations ? "Hide North Stations" : "View North Stations"}
              </button>
            </div>
          </>
        )}
        {stations.map((station, index) => {
          return(
            <>
              <li key={index} className="stop">
                {/* Station Name */}
                <h3
                  style={{ cursor: "pointer" }}
                  >
                    {station.name}
                </h3>
                  {/* Station Details */}
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
            </>
          );
        })}
        </ul>
    </div>
  );
};

export default Stations;
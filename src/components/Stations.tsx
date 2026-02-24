import { useState } from "react";
import redline_stations from "../data/redline";
import greenline_stations from "../data/greenline";
import purpleline_stations from "../data/purpleline";

type Line = "Red" | "Green" | "Purple";

const Stations = () => {
  const [currentLine, setCurrentLine] = useState<Line>("Red");

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

        <div>
          <button onClick={() => setCurrentLine("Red")}>Red</button>
          <button onClick={() => setCurrentLine("Green")}>Green</button>
          <button onClick={() => setCurrentLine("Purple")}>Purple</button>
        </div>

        <ul className={`stations stations--${currentLine.toLowerCase()}`}>
          {stations.map((station, index) => (
            <li key={index} className="stop">
              <h3>{station.name}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stations;
import { useState } from "react";

import "./styles/app.css";
import "./styles/arrivals.css";
import "./styles/stations.css";

// import type { Station } from "./types";
import type { LineName, LineResult } from "./types";

import Header from "./components/Header.tsx";
import Arrivals from "./components/Arrivals.tsx";
import Stations from "./components/Stations.tsx";
import NearestStation from "./components/NearestStation.tsx";

// type LineName = "red" | "green" | "purple" | "overall";

// type LineResult = {
//   station: Station;
//   miles: number;
//   walkTime: number;
// };



function App() {
  const [nearestStations, setNearestStations] = useState<
    Record<LineName, LineResult> | null
  >(null);

  return (
    <>
      <Header />
      <NearestStation onClosestChange={setNearestStations} />
      <Arrivals nearestStations={nearestStations}/>
      <Stations />
    </>
  );
}

export default App;
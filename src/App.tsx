import { useState } from "react";

import "./styles/app.css";
import "./styles/arrivals.css";
import "./styles/stations.css";

import type { Station } from "./types";

import Header from "./components/Header.tsx";
import BurnettArrivals from "./components/BurnettArrivals.tsx";
import Stations from "./components/Stations.tsx";
import NearestStation from "./components/NearestStation.tsx";

type LineName = "red" | "green" | "purple";

type LineResult = {
  station: Station;
  miles: number;
  walkTime: number;
};

function App() {
  const [nearestStations, setNearestStations] = useState<
    Record<LineName, LineResult> | null
  >(null);

  return (
    <>
      <Header />
      <NearestStation onClosestChange={setNearestStations} />
      {console.log(nearestStations)}
      <BurnettArrivals />
      <Stations />
    </>
  );
}

export default App;
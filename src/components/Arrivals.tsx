import { useState, useEffect } from "react";

const MIN_REFRESH_MS = 5000;

import type { BaseLineName, LineName, LineResult } from "../types";

type ArrivalsProps = {
  nearestStations: Record<LineName, LineResult> | null;
};

const routeMap: Record<BaseLineName, string> = {
  red: "Ho414_4620_700",
  green: "Ho414_4620_800",
  purple: "Ho414_4620_900",
};

// 🔥 Burnett fallback stops (Red Line only)
const burnettStops = {
  direction1: "Ho414_4620_25033",
  direction2: "Ho414_4620_25034",
};

export default function Arrivals({ nearestStations }: ArrivalsProps) {
  const [selectedLine, setSelectedLine] =
    useState<BaseLineName>("red");

    console.log(nearestStations)

  const [arrivals, setArrivals] = useState({
    direction1: [],
    direction2: [],
  });

  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // When nearestStations arrives → set default tab
  // ------------------------------------------------

  useEffect(() => {
    if (!nearestStations) return;

    const overallName =
      nearestStations.overall.station.name;

    const matchingLine = (["red", "green", "purple"] as BaseLineName[])
      .find(
        (line) =>
          nearestStations[line].station.name ===
          overallName
      );

    if (matchingLine) {
      setSelectedLine(matchingLine);
    }
  }, [nearestStations]);

  // ------------------------------------------------
  // Fetch arrivals
  // ------------------------------------------------

  const fetchArrivals = async () => {
    setLoading(true);

    try {
      let stop1: string;
      let stop2: string;
      let routeId: string;

      // 🔥 If nearestStations NOT ready → use Burnett
      if (!nearestStations) {
        stop1 = burnettStops.direction1;
        stop2 = burnettStops.direction2;
        routeId = routeMap.red;
      } else {
        const station =
          nearestStations[selectedLine].station;

        if (!station.direction_1_id || !station.direction_2_id) {
          throw new Error("Station is missing stop IDs");
        }

        stop1 = station.direction_1_id;
        stop2 = station.direction_2_id;
        routeId = routeMap[selectedLine];
      }

      const res = await fetch(
        `/.netlify/functions/arrivals?stop1=${stop1}&stop2=${stop2}&routeId=${routeId}`
      );

      const data = await res.json();
      setArrivals(data);

      const allTimes = [
        ...data.direction1,
        ...data.direction2,
      ].map((a: any) => new Date(a.ArrivalTime).getTime());

      const nextRefresh =
        allTimes.length > 0
          ? Math.max(Math.min(...allTimes) - Date.now(), MIN_REFRESH_MS)
          : 15000;

      setTimeout(fetchArrivals, nextRefresh);
    } catch (err) {
      console.error("Arrival fetch error:", err);
      setTimeout(fetchArrivals, 60000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, [selectedLine, nearestStations]);

  // ------------------------------------------------
  // Station Name Logic
  // ------------------------------------------------

  const stationName = !nearestStations
    ? "Burnett Transit Center"
    : nearestStations[selectedLine].station.name;

  const directionLabels =
    selectedLine === "red"
      ? { d1: "SOUTH", d2: "NORTH" }
      : { d1: "WEST", d2: "EAST" };

  // ------------------------------------------------

  if (loading)
    return (
      <div className="arrivals">
        <p>Loading light rail arrival times...</p>
      </div>
    );

  return (
    <div className="arrivals">
      {/* Line Selector */}
      <div className="line-selector">
        {(["red", "green", "purple"] as BaseLineName[]).map(
          (line) => (
            <button
              key={line}
              onClick={() => setSelectedLine(line)}
              className={
                selectedLine === line ? "active" : ""
              }
            >
              {line.toUpperCase()}
            </button>
          )
        )}
      </div>

      <h2>{stationName}</h2>

      {nearestStations && 
      
        <div>{nearestStations[selectedLine].walkTime} min
        </div>}

      <div className="arrivals-flex">
        <ul>
          {arrivals.direction1.length === 0 ? (
            <li>- No upcoming arrivals.</li>
          ) : (
            arrivals.direction1.map((a: any) => (
              <li key={a.ArrivalId}>
                {new Date(
                  a.ArrivalTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                &nbsp;{directionLabels.d1}
              </li>
            ))
          )}
        </ul>

        <ul>
          {arrivals.direction2.length === 0 ? (
            <li>- No upcoming arrivals.</li>
          ) : (
            arrivals.direction2.map((a: any) => (
              <li key={a.ArrivalId}>
                {new Date(
                  a.ArrivalTime
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                &nbsp;{directionLabels.d2}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
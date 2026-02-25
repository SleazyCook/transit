// src/components/BurnettArrivals.tsx
import { useState, useEffect } from "react";

// Minimum refresh interval
const MIN_REFRESH_MS = 5000;

// Define type for a single arrival
export interface Arrival {
  ArrivalId: string;
  ArrivalTime: string;
  LocalArrivalTime?: string;
  DestinationName: string;
}

// State holding northbound and southbound arrays
export interface ArrivalsState {
  northbound: Arrival[];
  southbound: Arrival[];
}

import type { Station } from "../types";

type LineName = "red" | "green" | "purple";

type LineResult = {
  station: Station;
  miles: number;
  walkTime: number;
};

type ArrivalsProps = {
  nearestStations: Record<LineName, LineResult> | null;
};

export default function Arrivals({ nearestStations }: ArrivalsProps) {
  const [arrivals, setArrivals] = useState<ArrivalsState>({
    northbound: [] as Arrival[],
    southbound: [] as Arrival[],
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchArrivals = async () => {
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/burnett_arrivals");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      
      // Force TypeScript to know the shape of data
      const data: ArrivalsState = (await res.json()) as ArrivalsState;

      const now = new Date();
      const upcoming = (arr: Arrival[]) =>
        arr
          .filter(a => new Date(a.ArrivalTime) > now)
          .sort(
            (a, b) =>
              new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime()
          );

      const newArrivals: ArrivalsState = {
        northbound: upcoming(data.northbound),
        southbound: upcoming(data.southbound),
      };

      setArrivals(newArrivals);

      // Schedule next fetch based on earliest upcoming arrival
      const allTimes = [
        ...newArrivals.northbound,
        ...newArrivals.southbound,
      ].map(a => new Date(a.ArrivalTime).getTime());

      const nextRefresh =
        allTimes.length > 0
          ? Math.max(Math.min(...allTimes) - Date.now(), MIN_REFRESH_MS)
          : 15000;

      setTimeout(fetchArrivals, nextRefresh);
    } catch (err) {
      console.error("Error fetching arrivals:", err);
      setTimeout(fetchArrivals, 60000); // fallback retry 1 min
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, []);

  if (loading) return <div className="arrivals">
      <p>Loading light rail arrival times...</p></div>;

  return (
    <div className="arrivals">
      {/* Station Name */}
      <h2>Burnett Transit Center</h2>

      <div className="arrivals-flex">

      {/* <h2>Next Northbound Arrivals</h2> */}
      <ul className="arrival-times--list">
        {arrivals.northbound.length === 0 ? (
          <li>- No upcoming arrivals at the moment.</li>
        ) : (
          arrivals.northbound.map((a: Arrival) => (
            <li key={a.ArrivalId} className="arrival-times--time">
              {new Date(a.ArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              &nbsp;NORTH
            </li>
          ))
        )}
      </ul>

      {/* <h2>Next Southbound Arrivals</h2> */}
      <ul className="arrival-times--list">
        {arrivals.southbound.length === 0 ? (
          <li>- No upcoming arrivals at the moment.</li>
        ) : (
          arrivals.southbound.map((a: Arrival) => (
            <li key={a.ArrivalId} className="arrival-times--time">
              {new Date(a.ArrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
              &nbsp;SOUTH
            </li>
          ))
        )}
      </ul>

      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

// Minimum refresh interval
const MIN_REFRESH_MS = 5000;

// Define type for a single arrival
interface Arrival {
  ArrivalId: string;
  LocalArrivalTime: string;
  DestinationName: string;
}

// Type for the state holding northbound/southbound arrays
interface ArrivalsState {
  northbound: Arrival[];
  southbound: Arrival[];
}

export default function BurnettArrivals() {
  const [arrivals, setArrivals] = useState<ArrivalsState>({
    northbound: [],
    southbound: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // The fetch function you asked about
  const fetchArrivals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/burnett_arrivals");
      const data: ArrivalsState = await res.json();

      const now = new Date();
      const upcoming = (arr: Arrival[]) =>
        arr
          .filter(a => new Date(a.LocalArrivalTime) > now)
          .sort((a, b) => new Date(a.LocalArrivalTime).getTime() - new Date(b.LocalArrivalTime).getTime());

      const newArrivals = {
        northbound: upcoming(data.northbound),
        southbound: upcoming(data.southbound),
      };

      setArrivals(newArrivals);

      // Schedule next fetch based on earliest upcoming arrival
      const allTimes = [...newArrivals.northbound, ...newArrivals.southbound].map(a => new Date(a.LocalArrivalTime).getTime());
      let nextRefresh = 15000; // default
      if (allTimes.length > 0) {
        const nowMs = Date.now();
        nextRefresh = Math.max(Math.min(...allTimes) - nowMs, MIN_REFRESH_MS);
      }

      setTimeout(fetchArrivals, nextRefresh);

    } catch (err) {
      console.error("Error fetching arrivals:", err);
      setTimeout(fetchArrivals, 60000); // fallback retry 1 min
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchArrivals();
  }, []);

  if (loading) return <p>Loading arrivals...</p>;

  return (
    <div>
      <h2>Next Northbound Arrivals</h2>
      <ul>
        {arrivals.northbound.length
          ? arrivals.northbound.map(a => (
              <li key={a.ArrivalId}>
                {new Date(a.LocalArrivalTime).toLocaleTimeString()} → {a.DestinationName}
              </li>
            ))
          : <li>- No upcoming arrivals at the moment.</li>
        }
      </ul>

      <h2>Next Southbound Arrivals</h2>
      <ul>
        {arrivals.southbound.length
          ? arrivals.southbound.map(a => (
              <li key={a.ArrivalId}>
                {new Date(a.LocalArrivalTime).toLocaleTimeString()} → {a.DestinationName}
              </li>
            ))
          : <li>- No upcoming arrivals at the moment.</li>
        }
      </ul>
    </div>
  );
}
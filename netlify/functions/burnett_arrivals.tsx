import { useState, useEffect } from "react";

type Arrival = {
  ArrivalId: string;
  RouteId: string;
  ArrivalTime: string;
  LocalArrivalTime: string;
  DestinationName: string;
};

type ArrivalsState = {
  northbound: Arrival[];
  southbound: Arrival[];
};

const stops = [
  { name: "Northbound", key: "northbound" as const, id: "Ho414_4620_25033" },
  { name: "Southbound", key: "southbound" as const, id: "Ho414_4620_25034" }
];

const redLineRouteId = "Ho414_4620_700";
const MIN_REFRESH_MS = 5000;

export default function BurnettArrivals() {
  const [arrivals, setArrivals] = useState<ArrivalsState>({
    northbound: [],
    southbound: []
  });
  const [loading, setLoading] = useState(true);

  const fetchArrivals = async () => {
    setLoading(true);
    const now = new Date();
    let earliestArrival: Date | null = null;

    const newState: ArrivalsState = { northbound: [], southbound: [] };

    for (const stop of stops) {
      try {
        const res = await fetch(`/.netlify/functions/burnett_arrivals?stopId=${stop.id}`);
        const data: { value: Arrival[] } = await res.json();
        const arrivalsArray = Array.isArray(data.value) ? data.value : [];

        const upcoming = arrivalsArray
          .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
          .sort((a, b) => new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime())
          .slice(0, 4);

        if (upcoming.length > 0) {
          const firstTime = new Date(upcoming[0].ArrivalTime);
          if (!earliestArrival || firstTime < earliestArrival) earliestArrival = firstTime;
        }

        newState[stop.key] = upcoming;
      } catch (err) {
        console.error(`Error fetching ${stop.name} arrivals:`, err);
      }
    }

    setArrivals(newState);
    setLoading(false);

    // Schedule next fetch based on earliest upcoming arrival
    if (earliestArrival) {
      const nowMs = new Date().getTime();
      const arrivalMs = earliestArrival.getTime();
      const refreshIn = Math.max(arrivalMs - nowMs, MIN_REFRESH_MS);
      setTimeout(fetchArrivals, refreshIn);
    } else {
      setTimeout(fetchArrivals, 60000); // fallback: 1 min
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, []);

  if (loading) return <p>Loading Burnett Transit Center arrivals...</p>;

  return (
    <div>
      <h2>Next Northbound Arrivals</h2>
      <ul>
        {arrivals.northbound.length === 0 ? (
          <li>- No upcoming arrivals at the moment.</li>
        ) : (
          arrivals.northbound.map(a => (
            <li key={a.ArrivalId}>
              {new Date(a.ArrivalTime).toLocaleTimeString()} → {a.DestinationName}
            </li>
          ))
        )}
      </ul>

      <h2>Next Southbound Arrivals</h2>
      <ul>
        {arrivals.southbound.length === 0 ? (
          <li>- No upcoming arrivals at the moment.</li>
        ) : (
          arrivals.southbound.map(a => (
            <li key={a.ArrivalId}>
              {new Date(a.ArrivalTime).toLocaleTimeString()} → {a.DestinationName}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
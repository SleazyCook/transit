import { useState, useEffect } from "react";

export default function BurnettArrivals() {
  const [arrivals, setArrivals] = useState({ northbound: [], southbound: [] });
  const [loading, setLoading] = useState(true);

  const fetchArrivals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/burnett_arrivals");
      const data = await res.json();
      setArrivals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
    const interval = setInterval(fetchArrivals, 15000); // simple 15s refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading Burnett Transit Center arrivals...</p>;

  return (
    <div>
      <h2>Next Northbound Arrivals</h2>
      <ul>
        {arrivals.northbound.length
          ? arrivals.northbound.map(a => (
              <li key={a.ArrivalId}>
                {new Date(a.ArrivalTime).toLocaleTimeString()} → {a.DestinationName}
              </li>
            ))
          : <li>- No upcoming arrivals at the moment.</li>}
      </ul>

      <h2>Next Southbound Arrivals</h2>
      <ul>
        {arrivals.southbound.length
          ? arrivals.southbound.map(a => (
              <li key={a.ArrivalId}>
                {new Date(a.ArrivalTime).toLocaleTimeString()} → {a.DestinationName}
              </li>
            ))
          : <li>- No upcoming arrivals at the moment.</li>}
      </ul>
    </div>
  );
}
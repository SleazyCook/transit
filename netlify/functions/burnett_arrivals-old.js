import fetch from "node-fetch";

const stops = [
  { name: "Northbound", id: "Ho414_4620_25033" }, // Burnett NB
  { name: "Southbound", id: "Ho414_4620_25034" }  // Burnett SB
];

const redLineRouteId = "Ho414_4620_700";
const apiKey = process.env.METRO_API_KEY;

// Minimum refresh interval in milliseconds (avoid <5 sec to be kind to the API)
const MIN_REFRESH_MS = 5000;

async function getBurnettArrivals() {
  const now = new Date();
  let earliestArrival = null; // will track earliest upcoming arrival across all stops

  for (const stop of stops) {
    const url = `https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`;

    try {
      const response = await fetch(url, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey }
      });

      if (!response.ok) {
        console.error(`HTTP Error (${stop.name}):`, response.status, response.statusText);
        continue;
      }

      const data = await response.json();
      const arrivals = Array.isArray(data.value) ? data.value : [];

      // Filter only future arrivals for Red Line
      const upcoming = arrivals
        .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
        .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
        .slice(0, 4);

      // Track the earliest arrival for dynamic refresh
      if (upcoming.length > 0) {
        const firstTime = new Date(upcoming[0].ArrivalTime);
        if (!earliestArrival || firstTime < earliestArrival) earliestArrival = firstTime;
      }

      console.log(`\nNext ${stop.name} Red Line arrivals at Burnett:`);

      if (upcoming.length === 0) {
        console.log("- No upcoming arrivals at the moment.");
      } else {
        upcoming.forEach(a => {
          const t = new Date(a.ArrivalTime);
          console.log(`- ${t.toLocaleTimeString()} → ${a.DestinationName}`);
        });
      }

    } catch (err) {
      console.error(`Fetch/Parsing Error (${stop.name}):`, err);
    }
  }

  // Schedule next refresh based on earliest arrival
  if (earliestArrival) {
    const nowMs = new Date().getTime();
    const arrivalMs = earliestArrival.getTime();
    let refreshIn = Math.max(arrivalMs - nowMs, MIN_REFRESH_MS);
    console.log(`\nNext refresh in ${(refreshIn / 1000).toFixed(0)} seconds...\n`);

    setTimeout(getBurnettArrivals, refreshIn);
  } else {
    // No upcoming arrivals, check again in 1 minute
    console.log("\nNo upcoming arrivals, refreshing in 60 seconds...\n");
    setTimeout(getBurnettArrivals, 60000);
  }
}

// Start the polling loop
getBurnettArrivals();
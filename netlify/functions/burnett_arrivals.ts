import fetch from "node-fetch";

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

// Burnett stop IDs
const stops = [
  { key: "northbound", id: "Ho414_4620_25033" },
  { key: "southbound", id: "Ho414_4620_25034" },
];

const redLineRouteId = "Ho414_4620_700";

// Minimum refresh interval
const MIN_REFRESH_MS = 5000;

export async function handler(event: any, context: any) {
  const apiKey = process.env.METRO_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "METRO_API_KEY not set" }),
    };
  }

  const now = new Date();
  const result: ArrivalsState = { northbound: [], southbound: [] };

  try {
    for (const stop of stops) {
      const url = `https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`;
      const res = await fetch(url, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey },
      });

      if (!res.ok) {
        console.error(`HTTP error for stop ${stop.id}:`, res.status);
        continue;
      }

      const data = await res.json();
      const arrivals: Arrival[] = Array.isArray(data.value) ? data.value : [];

      // Only Red Line and upcoming
      const upcoming = arrivals
        .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
        .sort((a, b) => new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime())
        .slice(0, 4);

      result[stop.key] = upcoming;
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch arrivals" }),
    };
  }
}
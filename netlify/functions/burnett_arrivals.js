// /netlify/functions/burnett_arrivals.js
import fetch from "node-fetch";

const stops = [
  { name: "Northbound", id: "Ho414_4620_25033" }, // Burnett NB
  { name: "Southbound", id: "Ho414_4620_25034" }  // Burnett SB
];

const redLineRouteId = "Ho414_4620_700";

export async function handler(event, context) {
  const apiKey = process.env.METRO_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: "Missing METRO_API_KEY in environment" };
  }

  const now = new Date();
  const result = {};

  for (const stop of stops) {
    const url = `https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`;

    try {
      const response = await fetch(url, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey }
      });

      if (!response.ok) {
        result[stop.name] = { error: `HTTP ${response.status} - ${response.statusText}` };
        continue;
      }

      const data = await response.json();
      const arrivals = Array.isArray(data.value) ? data.value : [];

      const upcoming = arrivals
        .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
        .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
        .slice(0, 4)
        .map(a => ({
          time: new Date(a.ArrivalTime).toLocaleTimeString(),
          destination: a.DestinationName
        }));

      result[stop.name] = upcoming;

    } catch (err) {
      result[stop.name] = { error: err.message };
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
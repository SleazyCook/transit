// import fetch from "node-fetch";

// const stops = [
//   { name: "Northbound", key: "northbound", id: "Ho414_4620_25033" },
//   { name: "Southbound", key: "southbound", id: "Ho414_4620_25034" }
// ];

// const redLineRouteId = "Ho414_4620_700";

// export async function handler() {
//   const apiKey = process.env.METRO_API_KEY;
//   const now = new Date();
//   const result = { northbound: [], southbound: [] };

//   for (const stop of stops) {
//     try {
//       const res = await fetch(`https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`, {
//         headers: { "Ocp-Apim-Subscription-Key": apiKey }
//       });
//       const data = await res.json();
//       const arrivals = Array.isArray(data.value) ? data.value : [];

//       result[stop.key] = arrivals
//         .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
//         .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
//         .slice(0, 4);

//     } catch (err) {
//       console.error(`Error fetching ${stop.name}:`, err);
//     }
//   }

//   return {
//     statusCode: 200,
//     body: JSON.stringify(result)
//   };
// }

// netlify/functions/burnett_arrivals.js
const fetch = require("node-fetch"); // required for Node < 20

const stops = [
  { name: "Northbound", id: "Ho414_4620_25033", key: "northbound" },
  { name: "Southbound", id: "Ho414_4620_25034", key: "southbound" }
];

const redLineRouteId = "Ho414_4620_700";

async function fetchBurnett(stopId) {
  const apiKey = process.env.METRO_API_KEY;
  if (!apiKey) {
    console.error("❌ METRO_API_KEY is missing!");
    return [];
  }

  try {
    const url = `https://api.ridemetro.org/data/Stops('${stopId}')/Arrivals?$format=json`;

    // Use fetch, fallback to global fetch if available (Node 20+)
    const _fetch = globalThis.fetch || fetch;

    const res = await _fetch(url, {
      headers: { "Ocp-Apim-Subscription-Key": apiKey }
    });

    if (!res.ok) {
      console.error(`HTTP error for stop ${stopId}:`, res.status, res.statusText);
      return [];
    }

    const data = await res.json();
    const now = new Date();

    return (Array.isArray(data.value) ? data.value : [])
      .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
      .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
      .slice(0, 4);

  } catch (err) {
    console.error(`Fetch error for stop ${stopId}:`, err);
    return [];
  }
}

exports.handler = async function () {
  const result = { northbound: [], southbound: [] };

  for (const stop of stops) {
    result[stop.key] = await fetchBurnett(stop.id);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
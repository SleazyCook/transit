import fetch from "node-fetch";

const stops = [
  { name: "Northbound", key: "northbound", id: "Ho414_4620_25033" },
  { name: "Southbound", key: "southbound", id: "Ho414_4620_25034" }
];

const redLineRouteId = "Ho414_4620_700";

export async function handler() {
  const apiKey = process.env.METRO_API_KEY;
  const now = new Date();
  const result = { northbound: [], southbound: [] };

  for (const stop of stops) {
    try {
      const res = await fetch(`https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey }
      });
      const data = await res.json();
      const arrivals = Array.isArray(data.value) ? data.value : [];

      result[stop.key] = arrivals
        .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
        .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
        .slice(0, 4);

    } catch (err) {
      console.error(`Error fetching ${stop.name}:`, err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
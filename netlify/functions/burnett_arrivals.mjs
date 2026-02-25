const stops = [
  { name: "Northbound", key: "northbound", id: "Ho414_4620_25033" },
  { name: "Southbound", key: "southbound", id: "Ho414_4620_25034" }
];

const redLineRouteId = "Ho414_4620_700";

export async function handler() {
  const result = { northbound: [], southbound: [] };
  const apiKey = process.env.METRO_API_KEY;

  for (const stop of stops) {
    try {
      const res = await fetch(`https://api.ridemetro.org/data/Stops('${stop.id}')/Arrivals?$format=json`, {
        headers: { "Ocp-Apim-Subscription-Key": apiKey }
      });
      const data = await res.json();
      const now = new Date();
      const arrivalsArray = Array.isArray(data.value) ? data.value : [];
      result[stop.key] = arrivalsArray
        .filter(a => a.RouteId === redLineRouteId && new Date(a.ArrivalTime) > now)
        .sort((a, b) => new Date(a.ArrivalTime) - new Date(b.ArrivalTime))
        .slice(0, 4);
    } catch (err) {
      console.error(`Error fetching ${stop.name} arrivals:`, err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
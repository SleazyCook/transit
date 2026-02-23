import fetch from "node-fetch";

const redLineRouteId = "Ho414_4620_700"; // Red Line
const stopId = "Ho414_4620_25033"; // Burnett Transit Center SB

async function getRedLineRouteInfo() {
  const url = `https://api.ridemetro.org/data/FullRouteInfo?routeId=${redLineRouteId}&$format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.METRO_API_KEY
      }
    });

    if (!response.ok) {
      console.error("HTTP Error:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    console.log(`Route: ${data.RouteNameLong} (${data.RouteName})`);
    console.log(`Total Directions: ${data.Directions.length}`);

    data.Directions.forEach((dir, i) => {
      console.log(`\nDirection ${i + 1}: ${dir.DirectionVariants[0].DirectionVariantName}`);
      dir.DirectionVariants[0].Stops.forEach((s, idx) => {
        const stop = s.Stop;
        const isBurnett = stop.StopName.toLowerCase().includes("burnett");
        console.log(
          `${idx + 1}. ${stop.StopName} (${stop.StopId}) @ [${stop.Lat}, ${stop.Lon}]${isBurnett ? " <-- Burnett Transit Center" : ""}`
        );
      });
    });

  } catch (err) {
    console.error("Fetch/Parsing Error:", err);
  }
}

getRedLineRouteInfo();
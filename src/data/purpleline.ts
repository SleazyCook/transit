export interface Station {
  name: string;
  address: string;
  bike_parking?: boolean;
  connections?: string[];
  nearby?: string[];
}

const purpleline_stations: Station[] = [
  { name: "Theater District",
    address: "https://maps.google.com/?q=550%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Green Line"]
   },
  { name: "Central Station",
    address: "https://maps.google.com/?q=1110%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Red Line", "Green Line"]
   },
  { name: "Convention District",
    address: "https://maps.google.com/?q=1635%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Green Line"]
   },
  { name: "EaDo/Stadium",
    address: "https://maps.google.com/?q=2229%20Texas%20Ave.,%20Houston,%20TX%2077003",
    bike_parking: true,
    nearby: ["Shell Stadium"]
   },
  { name: "Leeland/Third Ward",
    address: "https://maps.google.com/?q=1506%20Scott%20St.,%20Houston,%20TX%2077003"
   },
  { name: "Elgin/Third Ward",
    address: "https://maps.google.com/?q=3114%20Scott%20St.,%20Houston,%20TX%2077004"
   },
  {
    name: "TSU / UH Athletics District",
    address: "https://maps.google.com/?q=3701%20Scott%20St.,%20Houston,%20TX%2077004"
  },
  { name: "UH South/University Oaks",
    address: "https://maps.google.com/?q=4455%20Wheeler%20Ave.,%20Houston,%20TX%2077004"
   },
  { name: "MacGregor Park/MLK",
    address: "https://maps.google.com/?q=4751%20Martin%20Luther%20King%20Blvd.,%20Houston,%20TX%2077021"
   },
  { name: "Palm Center Transit Center",
    address: "https://maps.google.com/?q=5409%20Griggs%20Road,%20Houston,%20TX%2077021"
   }
];

export default purpleline_stations;
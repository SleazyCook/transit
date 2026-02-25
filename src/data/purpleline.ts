export interface Station {
  name: string;
  address: string;
  bike_parking?: boolean;
  connections?: string[];
  nearby?: string[];
  lat: number;
  lng: number;
  direction_1_id?: string,
  direction_2_id?: string
}

// direction_1 = Southbound / Westbound
// direction_2 = Northbound / Eastbound

const purpleline_stations: Station[] = [
  { name: "Theater District",
    address: "https://maps.google.com/?q=550%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Green Line"],
    direction_1_id: "Ho414_4620_25052",
    lat: 29.760969,
    lng: -95.366257
   },
  { name: "Central Station",
    address: "https://maps.google.com/?q=1110%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Red Line", "Green Line"],
    direction_1_id: "Ho414_4620_25054",
    lat: 29.758368,
    lng: -95.361938
   },
  { name: "Convention District",
    address: "https://maps.google.com/?q=1635%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Green Line"],
    direction_1_id: "Ho414_4620_25056",
    lat: 29.754992,
    lng: -95.356331
   },
  { name: "EaDo/Stadium",
    address: "https://maps.google.com/?q=2229%20Texas%20Ave.,%20Houston,%20TX%2077003",
    bike_parking: true,
    nearby: ["Shell Stadium"],
    direction_1_id: "Ho414_4620_25057",
    lat: 29.753528,
    lng: -95.351979
   },
  { name: "Leeland/Third Ward",
    address: "https://maps.google.com/?q=1506%20Scott%20St.,%20Houston,%20TX%2077003",
    direction_1_id: "Ho414_4620_25071",
    lat: 29.738834,
    lng: -95.346008
   },
  { name: "Elgin/Third Ward",
    address: "https://maps.google.com/?q=3114%20Scott%20St.,%20Houston,%20TX%2077004",
    direction_1_id: "Ho414_4620_25075",
    lat: 29.72839,
    lng: -95.34991
   },
  {
    name: "TSU / UH Athletics District",
    address: "https://maps.google.com/?q=3701%20Scott%20St.,%20Houston,%20TX%2077004",
    direction_1_id: "Ho414_4620_25077",
    lat: 29.722086,
    lng: -95.351395
  },
  { name: "UH South/University Oaks",
    address: "https://maps.google.com/?q=4455%20Wheeler%20Ave.,%20Houston,%20TX%2077004",
    direction_1_id: "Ho414_4620_25079",
    lat: 29.716092,
    lng: -95.341195
   },
  { name: "MacGregor Park/MLK",
    address: "https://maps.google.com/?q=4751%20Martin%20Luther%20King%20Blvd.,%20Houston,%20TX%2077021",
    direction_1_id: "Ho414_4620_25081",
    lat: 29.70938,
    lng: -95.33654
   },
  { name: "Palm Center Transit Center",
    address: "https://maps.google.com/?q=5409%20Griggs%20Road,%20Houston,%20TX%2077021",
    direction_1_id: "Ho414_4620_25085",
    lat: 29.696466,
    lng: -95.332305
   }
];

export default purpleline_stations;
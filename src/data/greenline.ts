import type { Station } from '../types';

// direction_1 = Southbound / Westbound
// direction_2 = Northbound / Eastbound


const greenline_stations: Station[] = [
  { name: "Theater District",
    address: "https://maps.google.com/?q=550%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Purple Line Line"],
    direction_1_id: "Ho414_4620_25052",
    lat: 29.760969,
    lng: -95.366257
   },
  { name: "Central Station",
    address: "https://maps.google.com/?q=1110%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Purple Line", "Red Line"],
    direction_1_id: "Ho414_4620_25054",
    lat: 29.758368,
    lng: -95.361938
   },
  { name: "Convention District",
    address: "https://maps.google.com/?q=1635%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Purple Line"],
    direction_1_id: "Ho414_4620_25056",
    lat: 29.754992,
    lng: -95.356331
   },
  { name: "EaDo/Stadium",
    address: "https://maps.google.com/?q=2229%20Texas%20Ave.,%20Houston,%20TX%2077003",
    bike_parking: true,
    connections: ["Purple Line"],
    nearby: ["Shell Stadium"],
    direction_1_id: "Ho414_4620_25058",
    lat: 29.753566,
    lng: -95.351947
   },
  { name: "Coffee Plant/Second Ward",
    address: "https://maps.google.com/?q=3518%20Harrisburg%20Blvd.,%20Houston,%20TX%2077003",
    direction_1_id: "Ho414_4620_25060",
    lat: 29.747574,
    lng: -95.340096
   },
  { name: "Lockwood/Eastwood",
    address: "https://maps.google.com/?q=4536%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011",
    direction_1_id: "Ho414_4620_25062",
    lat: 29.743764,
    lng: -95.330146
   },
  { name: "Altic/Howard Hughes",
    address: "https://maps.google.com/?q=5510%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011",
    direction_1_id: "Ho414_4620_25064",
    lat: 29.741176,
    lng: -95.320147
   },
  { name: "Cesar Chavez/67th St",
    address: "https://maps.google.com/?q=6717%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011",
    direction_1_id: "Ho414_4620_25065",
    lat: 29.737329,
    lng: -95.307709
   },
  { name: "Magnolia Park Transit Center",
    address: "https://maps.google.com/?q=6948%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011",
    bike_parking: true,
    direction_1_id: "Ho414_4620_25067",
    lat: 29.735851,
    lng: -95.3029
   }
];

export default greenline_stations;
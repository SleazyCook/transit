export interface Station {
  name: string;
  address: string;
  bike_parking?: boolean;
  connections?: string[];
  naerby?: [""]
}

const greenline_stations = [
  { name: "Theater District",
    address: "https://maps.google.com/?q=550%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Purple Line Line"]
   },
  { name: "Central Station",
    address: "https://maps.google.com/?q=1110%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: ["Purple Line", "Red Line"]
   },
  { name: "Convention District",
    address: "https://maps.google.com/?q=1635%20Rusk%20St.,%20Houston,%20TX%2077002",
    connections: "Purple Line"
   },
  { name: "EaDo/Stadium",
    address: "https://maps.google.com/?q=2229%20Texas%20Ave.,%20Houston,%20TX%2077003",
    bike_parking: true,
    connections: ["Purple Line"],
    nearby: ["Shell Stadium"]
   },
  { name: "Coffee Plant/Second Ward",
    address: "https://maps.google.com/?q=3518%20Harrisburg%20Blvd.,%20Houston,%20TX%2077003"
   },
  { name: "Lockwood/Eastwood",
    address: "https://maps.google.com/?q=4536%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011"
   },
  { name: "Altic/Howard Hughes",
    address: "https://maps.google.com/?q=5510%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011"
   },
  { name: "Cesar Chavez/67th St",
    address: "https://maps.google.com/?q=6717%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011"
   },
  { name: "Magnolia Park Transit Center",
    address: "https://maps.google.com/?q=6948%20Harrisburg%20Blvd.,%20Houston,%20TX%2077011",
    bike_parking: true
   }
];

export default greenline_stations;
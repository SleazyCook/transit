export interface Station {
  name: string;
  address: string;
  bike_parking?: boolean;
  connections?: string[];
  nearby?: string[];
}

const redline_stations = [
  { name: "Northline Transit Center/HCC",
    address: "https://maps.google.com/?q=7850%20Fulton%20St.,%20Houston,%20TX%2077022"
  },
  { name: "Melbourne/North Lindale",
    address: "https://maps.google.com/?q=6321%20Fulton%20St.,%20Houston,%20TX%2077022"
   },
  { name: "Lindale Park",
    address: "https://maps.google.com/?q=5312%20Fulton%20St.,%20Houston,%20TX%2077009"
   },
  { name: "Cavalcade",
    address: "https://maps.google.com/?q=4719%20Fulton%20St.,%20Houston,%20TX%2077009",
    nearby: ["Khaosan Road Thai"]
   },
  { name: "Moody Park",
    address: "https://maps.google.com/?q=4719%20Fulton%20St.,%20Houston,%20TX%2077009",
    nearby: ["Moody Park", ]
   },
  { name: "Fulton/North Central",
    address: "https://maps.google.com/?q=2592%20Fulton%20St.,%20Houston,%20TX%2077009",
    nearby: ["Butterfly Pocket Park", "McDonald's"]
   },
  { name: "Quitman/Near Northside",
    address: "https://maps.google.com/?q=2321%20North%20Main%20St.,%20Houston,%20TX%2077009",
    bike_parking: true,
    nearby: ["White Oak Music Center"]
   },
  { name: "Burnett Transit Center / Casa de Amigos",
    address: "https://maps.google.com/?q=1460%20N%20Main%20St.,%20Houston,%20TX%2077009",
    bike_parking: true,
    nearby: ["Bad Astronaut Brewing Co.", "Poppa Burger"]
  },
  { name: "UH-Downtown",
    address: "https://maps.google.com/?q=6%20North%20Main%20St.,%20Houston,%20TX%2077002",
    nearby: ["UH Downtown", "Buffalo Bayou Bike Trail", "White Oak Bayou Greenway"]
  },
  { name: "Preston",
    address: "https://maps.google.com/?q=367%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true,
    nearby: ["Market Square Park", "La Calle Tacos", "Notsuoh", "Behind Closed Doors", "Cherry", "Fabian's Latin Flavors", "Off the Record", "Bungalow", "CRU - Downtown", "Warren's"]
   },
  { name: "Central Station Main",
    address: "https://maps.google.com/?q=714%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true,
    connections: ["Green Line", "Purple Line"],
    nearby: ["Flying Saucer Draught Imporium", "Shake Shack", "The Finn Food Hall", "Starbucks", "Murphy's Deli"]
   },
  { name: "Main Street Square",
    address: "https://maps.google.com/?q=960%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true,
    nearby: ["GreenStreet", "House of Blues", "Punchline", "Morton's Steakhouse", "Corner Bakery", "Phoenicia"]
   },
  { name: "Bell",
    address: "https://maps.google.com/?q=1453%20Main%20St.,%20Houston,%20TX%2077002",
    nearby: ["Trelby Park"]
   },
  {
    name: "Downtown Transit Center",
    address: "https://maps.google.com/?q=1840%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true,
    nearby: ["Metro Ride Store", "Pappas Bar-B-Q"]
  },
  { name: "McGowen",
    address: "https://maps.google.com/?q=2560%20Main%20St.,%20Houston,%20TX%2077002",
    nearby: ["Red Cat Jazz Cafe", "Warehouse Live", "Gypsy Poet", "Midtown Park"]
   },
  { name: "Ensemble/HCC",
    address: "https://maps.google.com/?q=3509%20Main%20St.,%20Houston,%20TX%2077002",
    nearby: ["Home Slice Pizza", "Spicy Girl", "Sig's Lagoon Record Shop", "Breakfast Klub"]
   },
  { name: "Wheeler",
    address: "https://maps.google.com/?q=4590%20Main%20St.,%20Houston,%20TX%2077002",
    nearby: ["The Ion"]
   },
  { name: "Museum District",
    address: "https://maps.google.com/?q=5640%20San%20Jacinto%20St.,%20Houston,%20TX%2077004",
    nearby: ["Bodega's Taco Shop", "Museum of Fine Arts", "Museum of Natural Science", "McGovern Garden Falls", ""]
   },
  { name: "Hermann Park/Rice U",
    address: "https://maps.google.com/?q=6098%20Fannin%20St.,%20Houston,%20TX%2077030",
    nearby: ["Hermann Park", "Japanese Garden", "McGovern Garden Falls", "Rice University"]
   },
  { name: "Memorial Hermann Hospital/Houston Zoo",
    address: "https://maps.google.com/?q=6413%20Fannin%20St.,%20Houston,%20TX%2077030",
    nearby: ["Hermann Park", "Memorial Hermann Medical Center"]
   },
  { name: "Dryden/TMC",
    address: "https://maps.google.com/?q=6607%20Fannin%20St.,%20Houston,%20TX%2077021",
    nearby: ["Westin Houston Medical Center"]
   },
  { name: "TMC Transit Center",
    address: "https://maps.google.com/?q=6934%20Fannin%20St.,%20Houston,%20TX%2077030",
    nearby: ["MD Anderson Prarie", "Brays Bayou Greenway Trail"]
   },
  { name: "Smith Lands",
    address: "https://maps.google.com/?q=7834%20Green Linebriar%20Drive,%20Houston,%20TX%2077054",
    nearby: ["Luby's"]
   },
  { name: "Stadium Park/Astrodome",
    address: "https://maps.google.com/?q=8168%20Fannin%20St.,%20Houston,%20TX%2077054",
    nearby: ["NRG Stadium"]
   },
  { name: "Fannin South",
    address: "https://maps.google.com/?q=1604%20West%20Bellfort%20Ave.,%20Houston,%20TX%2077054",
    nearby: ["Fannin South Transit Center"]
   }
];

export default redline_stations;
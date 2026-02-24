export interface Station {
  name: string;
  address: string;
  bike_parking?: boolean;
  connections?: string[];
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
    address: "https://maps.google.com/?q=4719%20Fulton%20St.,%20Houston,%20TX%2077009"
   },
  { name: "Moody Park",
    address: "https://maps.google.com/?q=4719%20Fulton%20St.,%20Houston,%20TX%2077009"
   },
  { name: "Fulton/North Central",
    address: "https://maps.google.com/?q=2592%20Fulton%20St.,%20Houston,%20TX%2077009"
   },
  { name: "Quitman/Near Northside",
    address: "https://maps.google.com/?q=2321%20North%20Main%20St.,%20Houston,%20TX%2077009",
    bike_parking: true,
   },
  { name: "Burnett Transit Center / Casa de Amigos",
    address: "https://maps.google.com/?q=1460%20N%20Main%20St.,%20Houston,%20TX%2077009",
    bike_parking: true
  },
  { name: "UH-Downtown",
    address: "https://maps.google.com/?q=6%20North%20Main%20St.,%20Houston,%20TX%2077002",
  },
  { name: "Preston",
    address: "https://maps.google.com/?q=367%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true
   },
  { name: "Central Station Main",
    address: "https://maps.google.com/?q=714%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true,
    connections: ["green", "purple"]
   },
  { name: "Main Street Square",
    address: "https://maps.google.com/?q=960%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true
   },
  { name: "Bell",
    address: "https://maps.google.com/?q=1453%20Main%20St.,%20Houston,%20TX%2077002"
   },
  {
    name: "Downtown Transit Center",
    address: "https://maps.google.com/?q=1840%20Main%20St.,%20Houston,%20TX%2077002",
    bike_parking: true
  },
  { name: "McGowen",
    address: "https://maps.google.com/?q=2560%20Main%20St.,%20Houston,%20TX%2077002"
   },
  { name: "Ensemble/HCC",
    address: "https://maps.google.com/?q=3509%20Main%20St.,%20Houston,%20TX%2077002"
   },
  { name: "Wheeler",
    address: "https://maps.google.com/?q=4590%20Main%20St.,%20Houston,%20TX%2077002"
   },
  { name: "Museum District",
    address: "https://maps.google.com/?q=5640%20San%20Jacinto%20St.,%20Houston,%20TX%2077004"
   },
  { name: "Hermann Park/Rice U",
    address: "https://maps.google.com/?q=6098%20Fannin%20St.,%20Houston,%20TX%2077030"
   },
  { name: "Memorial Hermann Hospital/Houston Zoo",
    address: "https://maps.google.com/?q=6413%20Fannin%20St.,%20Houston,%20TX%2077030"
   },
  { name: "Dryden/TMC",
    address: "https://maps.google.com/?q=6607%20Fannin%20St.,%20Houston,%20TX%2077021"
   },
  { name: "TMC Transit Center",
    address: "https://maps.google.com/?q=6934%20Fannin%20St.,%20Houston,%20TX%2077030"
   },
  { name: "Smith Lands",
    address: "https://maps.google.com/?q=7834%20Greenbriar%20Drive,%20Houston,%20TX%2077054"
   },
  { name: "Stadium Park/Astrodome",
    address: "https://maps.google.com/?q=8168%20Fannin%20St.,%20Houston,%20TX%2077054"
   },
  { name: "Fannin South",
    address: "https://maps.google.com/?q=1604%20West%20Bellfort%20Ave.,%20Houston,%20TX%2077054"
   }
];

export default redline_stations;
import { useState } from 'react';

import './styles/app.css'
import './styles/arrivals.css'
import './styles/stations.css'

import type { Station } from './types';

import Header from './components/Header.tsx'
import BurnettArrivals from './components/BurnettArrivals.tsx'
import Stations from './components/Stations.tsx'
import NearestStation from './components/NearestStation.tsx'

function App() {
  const [redStation, setRedStation] = useState<Station | null>(null);
  const [greenStation, setGreenStation] = useState<Station | null>(null);
  const [purpleStation, setPurpleStation] = useState<Station | null>(null);

  return (
    <>
      <Header />
      <NearestStation 
        onClosestRed={setRedStation}
        onClosestGreen={setGreenStation}
        onClosestPurple={setPurpleStation}/>
        
              <h2>Parent knows the nearest stations:</h2>
      {redStation && <div>Red: {redStation.name}</div>}
      {greenStation && <div>Green: {greenStation.name}</div>}
      {purpleStation && <div>Purple: {purpleStation.name}</div>}
      <BurnettArrivals />
      <Stations />
    </>
  )
}

export default App

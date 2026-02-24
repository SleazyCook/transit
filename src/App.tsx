import './styles/app.css'
import './styles/arrivals.css'
import './styles/stations.css'

import Header from './components/Header.tsx'
import BurnettArrivals from './components/BurnettArrivals.tsx'
import Stations from './components/Stations.tsx'
import NearestStation from './components/NearestStation.tsx'

function App() {

  return (
    <>
      <Header />
      <NearestStation />
      <BurnettArrivals />
      <Stations />
    </>
  )
}

export default App

import './App.css'
import './styles/redline.css'

import Header from './components/Header.tsx'
import BurnettArrivals from './components/BurnettArrivals.tsx'
import RedLine from './components/RedLine.tsx'

function App() {

  return (
    <>
      <Header />
      <h1>Burnett Transit Center Arrivals</h1>
      <BurnettArrivals />
      <RedLine />
    </>
  )
}

export default App

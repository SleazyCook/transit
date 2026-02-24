import redline_stops from "../data/redline"

const RedLine = () => {
    return(
        <div className="transit-line">
            <div id="content">
                <h1>Red Line Stations</h1>

                <ul className="timeline">
                    {redline_stops.map((stop, index) => (
                        <li key={index} className="event">
                            <h3>{stop.name}</h3>
                        </li>
                        ))}
                </ul>
            </div>
        </div>
    )
}

export default RedLine;
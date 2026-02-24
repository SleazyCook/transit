const StationSelector = () => {
    return(
        <>
            <ul className="accordion_menus">
                {/* Red Line */}
                <li className="accordion accordion--red">
                    <div className="accordion_closed">
                        RED
                    </div>
                    <div className="accordion_open">
                        Red Line
                    </div>
                </li>
                {/* Green Line */}
                <li className="accordion accordion--green">
                    <div className="accordion_closed">
                        GREEN
                    </div>
                    <div className="accordion_open">
                        Green Line
                    </div>
                </li>
                {/* Purple Line */}
                <li className="accordion accordion--purple">
                    <div className="accordion_closed">
                        PURPLE
                    </div>
                    <div className="accordion_open">
                        Purple Line
                    </div>
                </li>
            </ul>
        </>
    )
}

export default StationSelector;
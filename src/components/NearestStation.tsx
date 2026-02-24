import { useState, useEffect } from 'react';

import redline_stations from '../data/redline';
import greenline_stations from '../data/greenline';
import purpleline_stations from '../data/purpleline';

type Station = {
    name: string;
    lat: number;
    lng: number;
};

const NearestStation = () => {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
    const [closestRed, setClosestRed] = useState<Station | null>(null);
    const [closestGreen, setClosestGreen] = useState<Station | null>(null);
    const [closestPurple, setClosestPurple] = useState<Station | null>(null);

    useEffect(() => {
        // Immediately set userLocation if possible
        if (!navigator.permissions) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude});
            }
        )
    }, []);

    // Request Location Permission
    const requestLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.")
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude});
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Location access is blocked. Please click the 🔒 icon in your address bar and allow location.")
                }
            }
        )
    }

    // Nearest station
    function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; //Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI/180);
        const dLon = (lon2 - lon1) * (Math.PI/180);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c // distance in km
    }

    function findClosestStation(
        userLocation: { lat: number; lng: number },
        stations: Station[]
        ): Station {
            return stations.reduce((prev, curr) => {
                const prevDist = getDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    prev.lat,
                    prev.lng
                );

                const currDist = getDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    curr.lat,
                    curr.lng
                );

                return currDist < prevDist ? curr : prev;
            });
    }

    useEffect(() => {
        if (!userLocation) return;
        // Closest Redline
        // const closest = redline_stations.reduce((prev, curr) => {
        //     const prevDist = getDistanceKm(
        //         userLocation.lat,
        //         userLocation.lng,
        //         prev.lat,
        //         prev.lng
        //     );

        //     const currDist = getDistanceKm(
        //         userLocation.lat,
        //         userLocation.lng,
        //         curr.lat,
        //         curr.lng
        //     );

        //     return currDist < prevDist ? curr : prev;
        // });

        // setClosestRedline(closest.name);
        setClosestRed(findClosestStation(userLocation, redline_stations));
        setClosestGreen(findClosestStation(userLocation, greenline_stations));
        setClosestPurple(findClosestStation(userLocation, purpleline_stations));


        
    }, [userLocation]);

    if (!userLocation) return(
        <>
            <div>
                <button onClick={requestLocation}>Use My Location</button>
            </div>
        </>
    )
    return (
        <>
            userLocation = {userLocation.lat}, {userLocation.lng}
            {closestRed && <div>{closestRed.name}</div>}
            {closestGreen && <div>{closestGreen.name}</div>}
            {closestPurple && <div>{closestPurple.name}</div>}
        </>
    )

}

export default NearestStation;
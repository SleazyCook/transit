import { useState, useEffect } from 'react';

import redline_stations from '../data/redline';
import greenline_stations from '../data/greenline';
import purpleline_stations from '../data/purpleline';

import type { Station } from '../types';

type NearestStationProps = {
  onClosestRed?: (station: Station) => void;
  onClosestGreen?: (station: Station) => void;
  onClosestPurple?: (station: Station) => void;
};

const NearestStation = ({
  onClosestRed,
  onClosestGreen,
  onClosestPurple
}: NearestStationProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [closestRed, setClosestRed] = useState<Station | null>(null);
  const [closestGreen, setClosestGreen] = useState<Station | null>(null);
  const [closestPurple, setClosestPurple] = useState<Station | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    );
    // Test location:
    // setUserLocation({ lat: 29.755590, lng: -95.364105 });
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access is blocked. Please enable location in your browser.");
        }
      }
    );
  };

  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const findClosestStation = (userLocation: { lat: number; lng: number }, stations: Station[]) => {
    const validStations = stations.filter((s) => s.lat !== undefined && s.lng !== undefined);
    return validStations.reduce((prev, curr) => {
      const prevDist = getDistanceKm(userLocation.lat, userLocation.lng, prev.lat!, prev.lng!);
      const currDist = getDistanceKm(userLocation.lat, userLocation.lng, curr.lat!, curr.lng!);
      return currDist < prevDist ? curr : prev;
    });
  };

  useEffect(() => {
    if (!userLocation) return;

    const red = findClosestStation(userLocation, redline_stations);
    const green = findClosestStation(userLocation, greenline_stations);
    const purple = findClosestStation(userLocation, purpleline_stations);

    setClosestRed(red);
    setClosestGreen(green);
    setClosestPurple(purple);

    // Pass to parent
    if (onClosestRed) onClosestRed(red);
    if (onClosestGreen) onClosestGreen(green);
    if (onClosestPurple) onClosestPurple(purple);
  }, [userLocation, onClosestRed, onClosestGreen, onClosestPurple]);

  if (!userLocation)
    return (
      <div>
        <button onClick={requestLocation}>Use My Location</button>
      </div>
    );

  return (
    <div>
      <div>
        Your Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
      </div>
      {closestRed && <div>Red Line: {closestRed.name}</div>}
      {closestGreen && <div>Green Line: {closestGreen.name}</div>}
      {closestPurple && <div>Purple Line: {closestPurple.name}</div>}
    </div>
  );
};

export default NearestStation;
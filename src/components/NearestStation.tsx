import { useState, useEffect } from "react";
import { FaPersonWalking } from "react-icons/fa6";

import redline_stations from "../data/redline";
import greenline_stations from "../data/greenline";
import purpleline_stations from "../data/purpleline";

import type { Station } from "../types";

type LineName = "red" | "green" | "purple";

type LineResult = {
  station: Station;
  miles: number;
  walkTime: number;
};

type NearestStationProps = {
  onClosestChange?: (results: Record<LineName, LineResult>) => void;
};

const lines: Record<LineName, Station[]> = {
  red: redline_stations,
  green: greenline_stations,
  purple: purpleline_stations,
};

const NearestStation = ({ onClosestChange }: NearestStationProps) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [closestStations, setClosestStations] = useState<
    Record<LineName, LineResult> | null
  >(null);

  // -------------------------
  // Location
  // -------------------------

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {}
    );
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location access is blocked. Please enable location.");
        }
      }
    );
  };

  // -------------------------
  // Distance Helpers
  // -------------------------

  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const findClosestStation = (
    location: { lat: number; lng: number },
    stations: Station[]
  ) => {
    const valid = stations.filter((s) => s.lat && s.lng);

    return valid.reduce((prev, curr) => {
      const prevDist = getDistanceKm(
        location.lat,
        location.lng,
        prev.lat!,
        prev.lng!
      );

      const currDist = getDistanceKm(
        location.lat,
        location.lng,
        curr.lat!,
        curr.lng!
      );

      return currDist < prevDist ? curr : prev;
    });
  };

  const calculateLineData = (
    location: { lat: number; lng: number },
    station: Station
  ): LineResult => {
    const distanceKm = getDistanceKm(
      location.lat,
      location.lng,
      station.lat!,
      station.lng!
    );

    return {
      station,
      miles: Math.round(distanceKm * 0.621371 * 10) / 10,
      walkTime: Math.round(distanceKm * 12),
    };
  };

  // -------------------------
  // Main Calculation
  // -------------------------

  useEffect(() => {
    if (!userLocation) return;

    const results = {} as Record<LineName, LineResult>;

    (Object.keys(lines) as LineName[]).forEach((line) => {
      const closest = findClosestStation(userLocation, lines[line]);
      results[line] = calculateLineData(userLocation, closest);
    });

    setClosestStations(results);

    // Pass everything to parent at once
    if (onClosestChange) {
      onClosestChange(results);
    }
  }, [userLocation, onClosestChange]);

  // -------------------------
  // UI
  // -------------------------

  if (!userLocation) {
    return (
      <div>
        <button onClick={requestLocation}>Use My Location</button>
      </div>
    );
  }

  if (!closestStations) return null;

  return (
    <div>
      {Object.entries(closestStations).map(([line, data]) => (
        <div key={line}>
          {line.toUpperCase()} Line: {data.station.name}{" "}
          <span>
            <FaPersonWalking /> {data.walkTime} min
          </span>{" "}
          <span>{data.miles} miles</span>
        </div>
      ))}
    </div>
  );
};

export default NearestStation;
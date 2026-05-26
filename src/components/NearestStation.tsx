import { useState, useEffect } from "react";

import redline_stations from "../data/redline";
import greenline_stations from "../data/greenline";
import purpleline_stations from "../data/purpleline";

import type { LineName, LineResult, Station } from "../types";

type NearestStationProps = {
  onClosestChange?: (results: Record<LineName, LineResult>) => void;
};

const NearestStation = ({ onClosestChange }: NearestStationProps) => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [, setClosestStations] = useState<
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
    // const valid = stations.filter((s) => s.lat && s.lng);
    const valid = stations.filter(
        (s) => s.lat !== undefined && s.lng !== undefined
    );

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

        const redClosest = calculateLineData(
            userLocation,
            findClosestStation(userLocation, redline_stations)
        );

        const greenClosest = calculateLineData(
            userLocation,
            findClosestStation(userLocation, greenline_stations)
        );

        const purpleClosest = calculateLineData(
            userLocation,
            findClosestStation(userLocation, purpleline_stations)
        );

        results.red = redClosest;
        results.green = greenClosest;
        results.purple = purpleClosest;

        // Priority: red > green > purple
        let overall = redClosest;

        if (greenClosest.miles < overall.miles) {
            overall = greenClosest;
        }

        if (purpleClosest.miles < overall.miles) {
            overall = purpleClosest;
        }

        results.overall = overall;

        setClosestStations(results);

        if (onClosestChange) {
            onClosestChange(results);
        }
    }, [userLocation, onClosestChange]);

    const formatMiles = (miles: number) => {
        return miles > 5 ? "> 5 miles" : `${miles} miles`;
    };

    const formatWalkTime = (minutes: number) => {
        if (minutes > 60) return "> 1 hr";
        return `${minutes} min`;
    };

  // -------------------------
  // UI — renders nothing; data flows up via onClosestChange
  // -------------------------

  void formatMiles;
  void formatWalkTime;

  return null;
};

export default NearestStation;
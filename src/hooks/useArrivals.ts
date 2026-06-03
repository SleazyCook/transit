import { useState, useEffect, useCallback } from 'react';
import type { BaseLineName, LineName, LineResult, Station } from '../types';
import { LINE_CONFIG } from '../config/lines';

import redline_stations from '../data/redline';
import greenline_stations from '../data/greenline';
import purpleline_stations from '../data/purpleline';

const MIN_REFRESH_MS = 5000;

const routeMap: Record<BaseLineName, string> = {
  red: 'Ho414_4620_700',
  green: 'Ho414_4620_800',
  purple: 'Ho414_4620_900',
};

const burnettStops = {
  direction1: 'Ho414_4620_25033',
  direction2: 'Ho414_4620_25034',
};

export const allLineStations: Record<BaseLineName, Station[]> = {
  red: redline_stations,
  green: greenline_stations,
  purple: purpleline_stations,
};

type ArrivalEntry = { ArrivalId: string; ArrivalTime: string };
type ArrivalsData = { direction1: ArrivalEntry[]; direction2: ArrivalEntry[] };

export type SortedArrival = ArrivalEntry & { dir: 'd1' | 'd2' };

export function etaSec(arrivalTime: string) {
  return Math.max(0, Math.floor((new Date(arrivalTime).getTime() - Date.now()) / 1000));
}

export function fmtEta(sec: number) {
  if (sec < 30) return 'Due';
  if (sec < 90) return 'Arriving';
  return Math.round(sec / 60) + ' min';
}

export function fmtCountdown(sec: number) {
  if (sec < 30) return { big: 'DUE', small: '' };
  const m = Math.floor(sec / 60);
  const s = String(Math.floor(sec % 60)).padStart(2, '0');
  return { big: String(m), small: `MIN ${s}s` };
}

export function useArrivals(
  selectedLine: BaseLineName,
  nearestStations: Record<LineName, LineResult> | null,
) {
  const [arrivals, setArrivals] = useState<ArrivalsData>({ direction1: [], direction2: [] });
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const stationName = nearestStations
    ? nearestStations[selectedLine].station.name
    : 'Burnett Transit Center / Casa de Amigos';

  const walkTime = nearestStations ? nearestStations[selectedLine].walkTime : null;
  const currentStation: Station | null = nearestStations
    ? nearestStations[selectedLine].station
    : null;

  const stations = allLineStations[selectedLine];
  const stationIdx = stations.findIndex((s) => s.name === stationName);

  const fetchArrivals = useCallback(async () => {
    setLoading(true);
    try {
      let stop1: string;
      let stop2: string;
      let routeId: string;

      if (!nearestStations) {
        stop1 = burnettStops.direction1;
        stop2 = burnettStops.direction2;
        routeId = routeMap.red;
      } else {
        const station = nearestStations[selectedLine].station;
        if (!station.direction_1_id || !station.direction_2_id) {
          throw new Error('Station missing stop IDs');
        }
        stop1 = station.direction_1_id;
        stop2 = station.direction_2_id;
        routeId = routeMap[selectedLine];
      }

      const res = await fetch(
        `/.netlify/functions/arrivals?stop1=${stop1}&stop2=${stop2}&routeId=${routeId}`,
      );
      const data: ArrivalsData = await res.json();
      setArrivals(data);

      const allTimes = [...data.direction1, ...data.direction2].map((a) =>
        new Date(a.ArrivalTime).getTime(),
      );
      const nextRefresh =
        allTimes.length > 0
          ? Math.max(Math.min(...allTimes) - Date.now(), MIN_REFRESH_MS)
          : 15000;
      setTimeout(fetchArrivals, nextRefresh);
    } catch {
      setTimeout(fetchArrivals, 60000);
    } finally {
      setLoading(false);
    }
  }, [selectedLine, nearestStations]);

  useEffect(() => {
    fetchArrivals();
  }, [fetchArrivals]);

  const line = LINE_CONFIG[selectedLine];

  const allSorted: SortedArrival[] = [
    ...arrivals.direction1.map((a) => ({ ...a, dir: 'd1' as const })),
    ...arrivals.direction2.map((a) => ({ ...a, dir: 'd2' as const })),
  ].sort((a, b) => new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime());

  const next = allSorted[0];
  const nextSec = next ? etaSec(next.ArrivalTime) : 0;
  void tick;

  const countdown = fmtCountdown(nextSec);
  const nextDirLabel = next
    ? next.dir === 'd1'
      ? line.direction1
      : line.direction2
    : '';

  return {
    loading,
    allSorted,
    next,
    nextSec,
    countdown,
    nextDirLabel,
    stationName,
    walkTime,
    currentStation,
    stationIdx,
    stations,
  };
}

import { useState } from 'react';
import type { BaseLineName } from '../types';

export type SavedStation = {
  line: BaseLineName;
  stationName: string;
};

export function useSavedStations() {
  const [saved, setSaved] = useState<SavedStation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('metro_saved') || '[]');
    } catch {
      return [];
    }
  });

  const isSaved = (line: BaseLineName, stationName: string) =>
    saved.some((s) => s.line === line && s.stationName === stationName);

  const toggle = (line: BaseLineName, stationName: string) => {
    setSaved((prev) => {
      const next = isSaved(line, stationName)
        ? prev.filter((s) => !(s.line === line && s.stationName === stationName))
        : [...prev, { line, stationName }];
      localStorage.setItem('metro_saved', JSON.stringify(next));
      return next;
    });
  };

  return { saved, isSaved, toggle };
}

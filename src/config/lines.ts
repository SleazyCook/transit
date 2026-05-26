import type { BaseLineName } from '../types';

export type LineConfig = {
  name: string;
  short: string;
  color: string;
  tint: string;
  dark: string;
  direction1: string;
  direction2: string;
  terminus1: string;
  terminus2: string;
};

export const LINE_CONFIG: Record<BaseLineName, LineConfig> = {
  red: {
    name: 'Red Line',
    short: 'RED',
    color: '#D80926',
    tint: '#FBE6E9',
    dark: '#7A0518',
    direction1: 'Southbound',
    direction2: 'Northbound',
    terminus1: 'Fannin South',
    terminus2: 'Northline TC',
  },
  green: {
    name: 'Green Line',
    short: 'GREEN',
    color: '#6A7C1B',
    tint: '#EEF0E0',
    dark: '#3D4710',
    direction1: 'Westbound',
    direction2: 'Eastbound',
    terminus1: 'Magnolia Park',
    terminus2: 'Theater District',
  },
  purple: {
    name: 'Purple Line',
    short: 'PURPLE',
    color: '#603353',
    tint: '#EEE4EB',
    dark: '#311926',
    direction1: 'Westbound',
    direction2: 'Eastbound',
    terminus1: 'MacGregor Park',
    terminus2: 'Theater District',
  },
};

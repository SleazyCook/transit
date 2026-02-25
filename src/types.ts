export type Station = {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  bike_parking?: boolean;
  connections?: string[];
  nearby?: string[];
  direction_1_id: string;
  direction_2_id?: string;
};

export type BaseLineName = "red" | "green" | "purple";
export type LineName = BaseLineName | "overall";

export type LineResult = {
  station: Station;
  miles: number;
  walkTime: number;
};
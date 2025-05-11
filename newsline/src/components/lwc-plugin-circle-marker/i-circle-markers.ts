import { Coordinate, TimePointIndex } from "lightweight-charts";

export interface TimedValue {
  time: TimePointIndex;
  x: Coordinate;
}

export type CircleMarkerPosition = "aboveBar" | "belowBar";

interface CircleMarkerBase<TimeType> {
  id?: string;
  time: TimeType;
  position: CircleMarkerPosition;
  size?: number;
  price?: number;
  text?: string;
  hovered: boolean;
}

export interface CircleMarker<TimeType> extends CircleMarkerBase<TimeType> {
  img?: HTMLImageElement;
}

export interface InternalCircleMarker<TimeType> extends CircleMarkerBase<TimeType> {
  internalId: number;
  originalTime: unknown;
}

export type UpdateType = "data" | "other" | "options";

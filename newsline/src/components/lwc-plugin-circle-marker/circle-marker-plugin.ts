import { CircleMarker } from "@/components/lwc-plugin-circle-marker/i-circle-markers.js";
import {
  CircleMarkerPaneView,
  CircleMarkerPrimitive,
} from "@/components/lwc-plugin-circle-marker/primitive";
import {
  DataChangedScope,
  IChartApi,
  ISeriesApi,
  LineData,
  MismatchDirection,
  SeriesOptionsMap,
  UTCTimestamp,
  WhitespaceData,
  LineSeries,
} from "lightweight-charts";

function hasValue(data: LineData | WhitespaceData): data is LineData {
  return (data as LineData).value !== undefined;
}

export class CircleMarkerPlugin {
  _chart: IChartApi | null = null;
  _series: ISeriesApi<keyof SeriesOptionsMap>;
  _primitive: CircleMarkerPrimitive;

  _markers: Map<string, CircleMarker<UTCTimestamp>> = new Map();

  constructor(series: ISeriesApi<keyof SeriesOptionsMap>) {
    this._series = series;
    this._primitive = new CircleMarkerPrimitive(this);
    this._series.attachPrimitive(this._primitive);
    this._chart = this._primitive.chart;
  }

  chart() {
    return this._chart;
  }

  series() {
    return this._series;
  }

  destroy() {
    this._series.detachPrimitive(this._primitive);
  }

  setMarkers(markers: CircleMarker<UTCTimestamp>[]): void {
    for (const marker of markers) {
      let id = (Math.random() * 100000).toFixed();
      while (this._markers.has(id)) {
        id = (Math.random() * 100000).toFixed();
      }
      this._markers.set(id, marker);
    }
    this._update();
  }

  removeMarker(id: string) {
    this._markers.delete(id);
    this._update();
  }

  _update() {
    this._primitive.requestUpdate();
  }
}

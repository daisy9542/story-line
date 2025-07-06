import { ISeriesApi, SeriesType, UTCTimestamp } from "lightweight-charts";
import { VerticalLinePrimitive } from "./vertical-line-primitive";

interface VerticalLineData {
  time: UTCTimestamp;
  color: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed";
}

export interface IVerticalLinePlugin {
  setData: (data: VerticalLineData | null) => void;
  getData: () => VerticalLineData | null;
  detach: () => void;
}

class VerticalLineWrapper implements IVerticalLinePlugin {
  private _primitive: VerticalLinePrimitive;
  private _series: ISeriesApi<SeriesType>;

  constructor(series: ISeriesApi<SeriesType>) {
    this._series = series;
    this._primitive = new VerticalLinePrimitive();
    this._series.attachPrimitive(this._primitive);
  }

  public setData(data: VerticalLineData | null): void {
    this._primitive.setData(data);
  }

  public getData(): VerticalLineData | null {
    return this._primitive.getData();
  }

  public detach(): void {
    this._series.detachPrimitive(this._primitive);
  }
}

export function createVerticalLinePlugin(series: ISeriesApi<SeriesType>): IVerticalLinePlugin {
  return new VerticalLineWrapper(series);
}

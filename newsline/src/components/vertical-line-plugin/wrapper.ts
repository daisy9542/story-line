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
    console.log("VerticalLineWrapper 构造函数被调用");
    this._series = series;
    this._primitive = new VerticalLinePrimitive();
    this._series.attachPrimitive(this._primitive);
    console.log("垂直线插件已附加到系列");
  }

  public setData(data: VerticalLineData | null): void {
    console.log("VerticalLineWrapper setData 被调用，data:", data);
    this._primitive.setData(data);
  }

  public getData(): VerticalLineData | null {
    return this._primitive.getData();
  }

  public detach(): void {
    console.log("VerticalLineWrapper detach 被调用");
    this._series.detachPrimitive(this._primitive);
  }
}

export function createVerticalLinePlugin(series: ISeriesApi<SeriesType>): IVerticalLinePlugin {
  console.log("createVerticalLinePlugin 被调用");
  return new VerticalLineWrapper(series);
}

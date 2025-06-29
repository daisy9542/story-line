import {
  ISeriesPrimitive,
  SeriesAttachedParameter,
  Time,
  UTCTimestamp,
  IPrimitivePaneView,
  IPrimitivePaneRenderer,
  Coordinate,
  PrimitiveHoveredItem,
  AutoscaleInfo,
} from "lightweight-charts";
import { CanvasRenderingTarget2D } from "fancy-canvas";

interface VerticalLineData {
  time: UTCTimestamp;
  color: string;
  lineWidth: number;
  lineStyle: "solid" | "dashed";
}

class VerticalLineRenderer implements IPrimitivePaneRenderer {
  private _data: VerticalLineData | null = null;
  private _x: Coordinate | null = null;

  public setData(data: VerticalLineData, x: Coordinate): void {
    this._data = data;
    this._x = x;
  }

  public hitTest(): null {
    return null; // 垂直线不需要交互
  }

  public draw(target: CanvasRenderingTarget2D): void {
    if (!this._data || this._x === null) return;

    target.useBitmapCoordinateSpace((scope) => {
      const { context: ctx, horizontalPixelRatio: hpr, verticalPixelRatio: vpr } = scope;
      const x = Math.round(this._x! * hpr); // 使用非空断言，因为上面已经检查过了

      ctx.save();
      ctx.strokeStyle = this._data!.color;
      ctx.lineWidth = this._data!.lineWidth * hpr;

      if (this._data!.lineStyle === "dashed") {
        ctx.setLineDash([5 * hpr, 3 * hpr]);
      } else {
        ctx.setLineDash([]); // 确保实线时清除虚线设置
      }

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, scope.bitmapSize.height);
      ctx.stroke();

      ctx.restore();
    });
  }
}

class VerticalLinePaneView implements IPrimitivePaneView {
  private _data: VerticalLineData | null = null;
  private _renderer: VerticalLineRenderer = new VerticalLineRenderer();
  private _chart: any;

  constructor(chart: any) {
    this._chart = chart;
  }

  public setData(data: VerticalLineData): void {
    this._data = data;
  }

  public renderer(): VerticalLineRenderer | null {
    if (!this._data) return null;

    const timeScale = this._chart.timeScale();
    const x = timeScale.timeToCoordinate(this._data.time);

    if (x === null) {
      return null;
    }

    this._renderer.setData(this._data, x);
    return this._renderer;
  }
}

export class VerticalLinePrimitive implements ISeriesPrimitive<Time> {
  private _paneView: VerticalLinePaneView | null = null;
  private _data: VerticalLineData | null = null;
  private _requestUpdate?: () => void;

  public attached(param: SeriesAttachedParameter<Time>): void {
    this._paneView = new VerticalLinePaneView(param.chart);
    this._requestUpdate = param.requestUpdate;
  }

  public detached(): void {
    this._paneView = null;
    this._requestUpdate = undefined;
  }

  public paneViews(): readonly IPrimitivePaneView[] {
    return this._paneView ? [this._paneView] : [];
  }

  public updateAllViews(): void {
    if (this._paneView && this._data) {
      this._paneView.setData(this._data);
    }
    if (this._requestUpdate) {
      this._requestUpdate();
    }
  }

  public setData(data: VerticalLineData | null): void {
    this._data = data;
    this.updateAllViews();
  }

  public getData(): VerticalLineData | null {
    return this._data;
  }

  // 添加必需的方法
  public hitTest(x: number, y: number): PrimitiveHoveredItem | null {
    return null;
  }

  public autoscaleInfo(): AutoscaleInfo | null {
    return null;
  }
}

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
  IChartApiBase,
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
    console.log("VerticalLineRenderer setData 被调用:", { data, x });
    this._data = data;
    this._x = x;
  }

  public hitTest(): null {
    return null; // 垂直线不需要交互
  }

  public draw(target: CanvasRenderingTarget2D): void {
    if (!this._data || this._x === null) {
      return;
    }

    console.log("绘制垂直线:", {
      time: this._data.time,
      x: this._x,
      color: this._data.color,
      lineWidth: this._data.lineWidth,
      lineStyle: this._data.lineStyle
    });

    target.useBitmapCoordinateSpace((scope) => {
      const { context: ctx, horizontalPixelRatio: hpr } = scope;
      const x = Math.round(this._x! * hpr);

      ctx.save();
      ctx.strokeStyle = this._data!.color;
      ctx.lineWidth = Math.max(1, this._data!.lineWidth * hpr);

      if (this._data!.lineStyle === "dashed") {
        ctx.setLineDash([5 * hpr, 3 * hpr]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, scope.bitmapSize.height);
      ctx.stroke();

      console.log("垂直线绘制完成");
      ctx.restore();
    });
  }
}

class VerticalLinePaneView implements IPrimitivePaneView {
  private _data: VerticalLineData | null = null;
  private _renderer: VerticalLineRenderer = new VerticalLineRenderer();
  private _chart: IChartApiBase<Time>;

  constructor(chart: IChartApiBase<Time>) {
    this._chart = chart;
    console.log("VerticalLinePaneView 构造函数被调用");
  }

  public setData(data: VerticalLineData): void {
    console.log("VerticalLinePaneView setData 被调用，data:", data);
    this._data = data;
  }

  public renderer(): VerticalLineRenderer | null {
    console.log("VerticalLinePaneView renderer 被调用，_data:", !!this._data);
    
    if (!this._data) {
      console.log("VerticalLinePaneView renderer 返回 null，因为没有数据");
      return null;
    }

    const timeScale = this._chart.timeScale();
    const x = timeScale.timeToCoordinate(this._data.time);

    console.log("时间坐标转换:", {
      time: this._data.time,
      x: x,
      timeScaleExists: !!timeScale
    });

    if (x === null) {
      console.log("时间坐标转换失败，时间:", this._data.time);
      return null;
    }

    this._renderer.setData(this._data, x);
    console.log("VerticalLinePaneView renderer 返回 renderer");
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
    const views = this._paneView ? [this._paneView] : [];
    return views;
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

  public hitTest(): PrimitiveHoveredItem | null {
    return null;
  }

  public autoscaleInfo(): AutoscaleInfo | null {
    return null;
  }
}

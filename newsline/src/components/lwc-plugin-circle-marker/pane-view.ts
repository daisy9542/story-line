/**
 * 参考：https://github.com/tradingview/lightweight-charts/blob/master/src/plugins/series-markers/pane-view.ts
 */
import {
  IPrimitivePaneView,
  ISeriesApi,
  IChartApiBase,
  SeriesType,
  Coordinate,
  TimePointIndex,
  Logical,
  MismatchDirection,
  SeriesDataItemTypeMap,
  CandlestickData,
} from "lightweight-charts";
import { RenderItem, RenderData, CircleMarkerRenderer } from "./renderer";
import { InternalCircleMarker, UpdateType } from "./i-circle-markers";
import { RangeImpl } from "@/lib/utils";
import { calcShapeHeight, calcShapeMargin, visibleTimedValues } from "./helper/utils";
import { ensureNotNull } from "./helper/assertions";
import { isNumber } from "./helper/strict-type-checks";

interface Offsets {
  aboveBar: number;
  belowBar: number;
}

function isOhlcData<HorzScaleItem>(
  data: SeriesDataItemTypeMap<HorzScaleItem>[SeriesType],
): data is CandlestickData<HorzScaleItem> {
  return "open" in data && "high" in data && "low" in data && "close" in data;
}

function getPrice(
  seriesData: SeriesDataItemTypeMap<unknown>[SeriesType],
  marker: InternalCircleMarker<TimePointIndex>,
): number | undefined {
  if (isOhlcData(seriesData)) {
    if (marker.position === "aboveBar") {
      return seriesData.high;
    } else if (marker.position === "belowBar") {
      return seriesData.low;
    }
  }
  return;
}

/**
 * 根据 marker 和系列数据，计算渲染器项的尺寸和纵坐标，并更新堆叠偏移量
 */
function fillSizeAndY<HorzScaleItem>(
  rendererItem: RenderItem,
  marker: InternalCircleMarker<TimePointIndex>,
  seriesData: SeriesDataItemTypeMap<HorzScaleItem>[SeriesType],
  offsets: Offsets,
  shapeMargin: number,
  series: ISeriesApi<SeriesType, HorzScaleItem>,
  chart: IChartApiBase<HorzScaleItem>,
): void {
  // 获取标记对应的价格值，如果不存在则跳过
  const price = getPrice(seriesData, marker);
  if (price === undefined) {
    return;
  }

  // 获取时间轴实例，用于读取 barSpacing
  const timeScale = chart.timeScale();
  // 计算尺寸系数：如果 marker.size 是数字，就取最大值；否则默认为 1
  const sizeMultiplier = isNumber(marker.size) ? Math.max(marker.size, 0) : 1;
  // 基于当前 barSpacing 和尺寸系数，求出形状最终像素大小
  const shapeSize = calcShapeHeight(timeScale.options().barSpacing) * sizeMultiplier;

  const halfSize = shapeSize / 2;
  rendererItem.size = shapeSize;

  // 标记位置（'aboveBar' 或 'belowBar'）
  const position = marker.position;

  switch (position) {
    case "aboveBar": {
      // 上方堆叠：基准线为价格对应的像素坐标
      const offset = offsets.aboveBar;
      // y = 价格坐标 - 半高 - 当前上方偏移
      rendererItem.y = (ensureNotNull(series.priceToCoordinate(price)) -
        halfSize -
        offset) as Coordinate;
      // 再增加形状本身和形状间距的偏移
      offsets.aboveBar += shapeSize + shapeMargin;
      return;
    }
    case "belowBar": {
      const offset = offsets.belowBar;
      rendererItem.y = (ensureNotNull(series.priceToCoordinate(price)) +
        halfSize +
        offset) as Coordinate;
      offsets.belowBar += shapeSize + shapeMargin;
      return;
    }
  }
}

export class CircleMarkerPaneView<HorzScaleItem> implements IPrimitivePaneView {
  private readonly _series: ISeriesApi<SeriesType, HorzScaleItem>;
  private readonly _chart: IChartApiBase<HorzScaleItem>;
  private _data: RenderData;
  private _markers: InternalCircleMarker<TimePointIndex>[] = [];
  private _invalidated: boolean = true;
  private _dataInvalidated: boolean = true;
  private _renderer: CircleMarkerRenderer = new CircleMarkerRenderer();

  constructor(series: ISeriesApi<SeriesType, HorzScaleItem>, chart: IChartApiBase<HorzScaleItem>) {
    this._series = series;
    this._chart = chart;
    this._data = {
      items: [],
      visibleRange: null,
    };
  }

  public renderer(): CircleMarkerRenderer | null {
    if (!this._series.options().visible) {
      return null;
    }
    if (this._invalidated) {
      this._makeValid();
    }
    const layout = this._chart.options()["layout"];
    this._renderer.setParams(layout.fontSize, layout.fontFamily);
    this._renderer.setData(this._data);
    return this._renderer;
  }

  public setMarkers(markers: InternalCircleMarker<TimePointIndex>[]): void {
    this._markers = markers;
    this.update("data");
  }

  public update(updateType?: UpdateType): void {
    this._invalidated = true;
    if (updateType === "data") {
      this._dataInvalidated = true;
    }
  }

  protected _makeValid(): void {
    const timeScale = this._chart.timeScale();
    const circleMarkers = this._markers;
    if (this._dataInvalidated) {
      // 数据被标记为失效，先做一次完整的初始化
      this._data.items = circleMarkers.map<RenderItem>(
        (marker: InternalCircleMarker<TimePointIndex>) => ({
          time: marker.time,
          x: 0 as Coordinate, // 占位，稍后计算
          y: 0 as Coordinate, // 同上
          size: 0, // 同上
          externalId: marker.id,
          internalId: marker.internalId,
          text: marker.text,
          imgUrl: undefined,
          hovered: marker.hovered,
        }),
      );
      this._dataInvalidated = false;
    }

    this._data.visibleRange = null;
    const visibleBars = timeScale.getVisibleLogicalRange();
    if (visibleBars === null) {
      // 时间轴还没任何可视 bar
      return;
    }
    const visibleBarsRange = new RangeImpl(
      Math.floor(visibleBars.from) as TimePointIndex,
      Math.ceil(visibleBars.to) as TimePointIndex,
    );
    const firstValue = this._series.data()[0];
    if (firstValue === null) {
      return;
    }
    if (this._data.items.length === 0) {
      // 没有数据
      return;
    }
    let prevTimeIndex = NaN;
    const shapeMargin = calcShapeMargin(timeScale.options().barSpacing);
    const offsets: Offsets = {
      aboveBar: shapeMargin,
      belowBar: shapeMargin,
    };
    this._data.visibleRange = visibleTimedValues(this._data.items, visibleBarsRange, true);
    for (let index = this._data.visibleRange.from; index < this._data.visibleRange.to; index++) {
      const marker = circleMarkers[index];
      if (marker.time !== prevTimeIndex) {
        // 新的 bar，重置偏移
        offsets.aboveBar = shapeMargin;
        offsets.belowBar = shapeMargin;
        prevTimeIndex = marker.time;
      }
      const rendererItem = this._data.items[index];
      rendererItem.x = ensureNotNull(
        timeScale.logicalToCoordinate(marker.time as unknown as Logical),
      );

      const dataAt = this._series.dataByIndex(marker.time, MismatchDirection.None);
      if (dataAt === null) {
        continue;
      }
      fillSizeAndY<HorzScaleItem>(
        rendererItem,
        marker,
        dataAt,
        offsets,
        shapeMargin,
        this._series,
        this._chart,
      );
    }
    this._invalidated = false;
  }
}

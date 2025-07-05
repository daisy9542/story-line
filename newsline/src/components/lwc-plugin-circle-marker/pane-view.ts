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
import { calcShapeHeight, calcShapeMargin } from "./helper/utils";
import { ensureNotNull } from "./helper/assertions";
import { isNumber } from "./helper/strict-type-checks";

interface Offsets {
  aboveBar: number;
  belowBar: number;
}

// 聚合标记接口
interface AggregatedMarker {
  markers: InternalCircleMarker<TimePointIndex>[];
  centerTime: TimePointIndex;
  centerX: Coordinate;
  count: number;
  position: "aboveBar" | "belowBar";
  representativeMarker: InternalCircleMarker<TimePointIndex>; // 权重最大的代表性标记
}

// 聚合配置
interface AggregationConfig {
  minPixelDistance: number; // 最小像素距离，小于此距离的标记会被聚合
  maxZoomLevel: number; // 最大缩放级别，超过此级别不再聚合
  animationDuration: number; // 动画持续时间（毫秒）
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
 * 计算两个标记之间的像素距离
 */
function calculatePixelDistance(
  marker1: InternalCircleMarker<TimePointIndex>,
  marker2: InternalCircleMarker<TimePointIndex>,
  timeScale: { logicalToCoordinate: (logical: Logical) => Coordinate },
): number {
  const x1 = timeScale.logicalToCoordinate(marker1.time as unknown as Logical);
  const x2 = timeScale.logicalToCoordinate(marker2.time as unknown as Logical);
  return Math.abs(x1 - x2);
}

/**
 * 根据当前缩放级别和配置，对标记进行聚合
 */
function aggregateMarkers(
  markers: InternalCircleMarker<TimePointIndex>[],
  timeScale: { options: () => { barSpacing: number }; logicalToCoordinate: (logical: Logical) => Coordinate },
  config: AggregationConfig,
): AggregatedMarker[] {
  if (markers.length === 0) return [];

  // 计算当前缩放级别（基于 barSpacing）
  const barSpacing = timeScale.options().barSpacing;
  const zoomLevel = Math.max(1, Math.log2(barSpacing / 6)); // 调整缩放级别计算

  // 如果缩放级别超过最大值，不进行聚合
  if (zoomLevel > config.maxZoomLevel) {
    return markers.map(marker => ({
      markers: [marker],
      centerTime: marker.time,
      centerX: timeScale.logicalToCoordinate(marker.time as unknown as Logical),
      count: 1,
      position: marker.position,
      representativeMarker: marker, // 单个标记就是代表
    }));
  }

  const aggregated: AggregatedMarker[] = [];
  const processed = new Set<number>();

  // 按位置分组处理
  const aboveBarMarkers = markers.filter(m => m.position === "aboveBar");
  const belowBarMarkers = markers.filter(m => m.position === "belowBar");


  [aboveBarMarkers, belowBarMarkers].forEach(positionMarkers => {
    if (positionMarkers.length === 0) return;

    // 按时间排序
    positionMarkers.sort((a, b) => a.time - b.time);

    for (let i = 0; i < positionMarkers.length; i++) {
      if (processed.has(positionMarkers[i].internalId)) continue;

      const cluster: InternalCircleMarker<TimePointIndex>[] = [positionMarkers[i]];
      processed.add(positionMarkers[i].internalId);

      // 查找相邻的可聚合标记
      for (let j = i + 1; j < positionMarkers.length; j++) {
        if (processed.has(positionMarkers[j].internalId)) continue;

        const distance = calculatePixelDistance(
          positionMarkers[i],
          positionMarkers[j],
          timeScale
        );


        if (distance <= config.minPixelDistance) {
          cluster.push(positionMarkers[j]);
          processed.add(positionMarkers[j].internalId);
        } else {
          break; // 由于已排序，后续标记距离只会更远
        }
      }

      // 选择权重最大的标记作为代表
      const representativeMarker = cluster.reduce((max, current) => {
        const maxInfluence = (max as InternalCircleMarker<TimePointIndex> & { influence?: number }).influence || 0;
        const currentInfluence = (current as InternalCircleMarker<TimePointIndex> & { influence?: number }).influence || 0;
        return currentInfluence > maxInfluence ? current : max;
      });

      const centerTime = representativeMarker.time;
      const centerX = timeScale.logicalToCoordinate(centerTime as unknown as Logical);


      aggregated.push({
        markers: cluster,
        centerTime,
        centerX,
        count: cluster.length,
        position: representativeMarker.position,
        representativeMarker, // 权重最大的标记
      });
    }
  });

  return aggregated;
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
  
  // 聚合相关属性
  private _aggregationConfig: AggregationConfig = {
    minPixelDistance: 50, // 50像素内的标记会被聚合
    maxZoomLevel: 15, // 缩放级别超过15时不再聚合
    animationDuration: 300, // 300ms动画时间
  };
  private _aggregatedMarkers: AggregatedMarker[] = [];
  private _lastBarSpacing: number = -1;
  private _focusedMarkerId: string | null = null;

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
    
    // 设置更新回调，当图标加载完成时重新渲染
    this._renderer.setUpdateCallback(() => {
      this.update();
    });
    
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

  /**
   * 配置聚合参数
   */
  public setAggregationConfig(config: Partial<AggregationConfig>): void {
    this._aggregationConfig = { ...this._aggregationConfig, ...config };
    this._lastBarSpacing = -1; // 强制重新聚合
    this.update("data");
  }

  /**
   * 获取当前聚合配置
   */
  public getAggregationConfig(): AggregationConfig {
    return { ...this._aggregationConfig };
  }

  /**
   * 设置聚焦的标记ID
   */
  public setFocusedMarkerId(markerId: string | null): void {
    this._focusedMarkerId = markerId;
    this.update();
  }

  protected _makeValid(): void {
    const timeScale = this._chart.timeScale();
    const currentBarSpacing = timeScale.options().barSpacing;
    
    // 检查是否需要重新聚合（缩放级别变化或数据变化）
    const needsReaggregation = this._lastBarSpacing !== currentBarSpacing || this._dataInvalidated;
    
    if (needsReaggregation) {
      this._lastBarSpacing = currentBarSpacing;
      
      // 获取可视区域
      const visibleBars = timeScale.getVisibleLogicalRange();
      if (visibleBars === null) {
        this._data.items = [];
        this._data.visibleRange = null;
        this._invalidated = false;
        return;
      }
      
      const visibleBarsRange = new RangeImpl(
        Math.floor(visibleBars.from) as TimePointIndex,
        Math.ceil(visibleBars.to) as TimePointIndex,
      );
      
      // 过滤出可视区域内的标记
      const visibleMarkers = this._markers.filter(marker => 
        marker.time >= visibleBarsRange.left() && marker.time <= visibleBarsRange.right()
      );
      
      // 对可视标记进行聚合
      this._aggregatedMarkers = aggregateMarkers(visibleMarkers, timeScale, this._aggregationConfig);
      
      // 根据聚合结果创建渲染项，使用代表性标记的信息
      this._data.items = this._aggregatedMarkers.map<RenderItem>(
        (aggregated: AggregatedMarker, index: number) => {
          const renderItem = {
            time: aggregated.centerTime,
            x: 0 as Coordinate, // 占位，稍后计算
            y: 0 as Coordinate, // 同上
            size: 0, // 同上
            externalId: aggregated.representativeMarker.id,
            internalId: index,
            text: aggregated.representativeMarker.text || "",
            imgUrl: undefined,
            hovered: aggregated.representativeMarker.hovered,
            focused: this._focusedMarkerId === aggregated.representativeMarker.id,
            // 添加聚合信息
            isAggregated: aggregated.count > 1,
            aggregatedCount: aggregated.count,
            // 添加图标和影响力信息
            icon: (aggregated.representativeMarker as InternalCircleMarker<TimePointIndex> & { icon?: string }).icon,
            influence: (aggregated.representativeMarker as InternalCircleMarker<TimePointIndex> & { influence?: number }).influence,
          };
          

          
          return renderItem;
        }
      );
      
      this._dataInvalidated = false;
    }

    // 检查基本条件
    const visibleBars = timeScale.getVisibleLogicalRange();
    if (visibleBars === null) {
      this._data.visibleRange = null;
      this._invalidated = false;
      return;
    }
    
    const firstValue = this._series.data()[0];
    if (firstValue === null || this._data.items.length === 0) {
      this._data.visibleRange = null;
      this._invalidated = false;
      return;
    }

    // 计算每个聚合标记的坐标和尺寸
    let prevTimeIndex = NaN;
    const shapeMargin = calcShapeMargin(timeScale.options().barSpacing);
    const offsets: Offsets = {
      aboveBar: shapeMargin,
      belowBar: shapeMargin,
    };

    // 设置可视范围（基于聚合后的数据）
    this._data.visibleRange = { from: 0, to: this._data.items.length };

    for (let index = 0; index < this._data.items.length; index++) {
      const aggregated = this._aggregatedMarkers[index];
      const rendererItem = this._data.items[index];
      
      if (aggregated.centerTime !== prevTimeIndex) {
        // 新的时间点，重置偏移
        offsets.aboveBar = shapeMargin;
        offsets.belowBar = shapeMargin;
        prevTimeIndex = aggregated.centerTime;
      }

      // 设置X坐标
      rendererItem.x = ensureNotNull(
        timeScale.logicalToCoordinate(aggregated.centerTime as unknown as Logical),
      );

      // 获取对应的系列数据来计算Y坐标
      const dataAt = this._series.dataByIndex(aggregated.centerTime, MismatchDirection.None);
      if (dataAt === null) {
        continue;
      }

      // 创建一个临时标记来计算位置
      const tempMarker: InternalCircleMarker<TimePointIndex> = {
        time: aggregated.centerTime,
        position: aggregated.position,
        internalId: index,
        originalTime: aggregated.centerTime,
        size: aggregated.count > 1 ? Math.min(aggregated.count * 0.3 + 1, 2) : 1, // 聚合标记稍大
        text: rendererItem.text,
        hovered: rendererItem.hovered,
      };

      fillSizeAndY<HorzScaleItem>(
        rendererItem,
        tempMarker,
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

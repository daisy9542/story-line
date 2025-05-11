/**
 * 参考 https://github.com/tradingview/lightweight-charts/blob/master/src/plugins/series-markers/primitive.ts
 */
import {
  IChartApiBase,
  ISeriesApi,
  ISeriesPrimitive,
  SeriesType,
  TimePointIndex,
  DataChangedHandler,
  SeriesAttachedParameter,
  IPrimitivePaneView,
  PrimitiveHoveredItem,
  AutoscaleInfo,
  Logical,
  DataChangedScope,
  MismatchDirection,
  SeriesMarkerPosition,
} from "lightweight-charts";
import { CircleMarkerPaneView } from "./pane-view";
import { InternalCircleMarker, CircleMarker, UpdateType } from "./i-circle-markers";
import { ensureNotNull } from "./helper/assertions";
import { calcAdjustedMargin, calcShapeHeight, calcShapeMargin } from "./helper/utils";

interface AutoScaleMargins {
  /** The number of pixels for bottom margin */
  below: number;
  /** The number of pixels for top margin */
  above: number;
}

type MarkerPositions = Record<SeriesMarkerPosition, boolean>;

export class CircleMarkerPrimitive<HorzScaleItem> implements ISeriesPrimitive<HorzScaleItem> {
  private _paneView: CircleMarkerPaneView<HorzScaleItem> | null = null;
  private _markers: CircleMarker<HorzScaleItem>[] = [];
  /** 转换后的带索引和时间点的内部标记 */
  private _indexedMarkers: InternalCircleMarker<TimePointIndex>[] = [];
  private _dataChangedHandler: DataChangedHandler | null = null;
  private _series: ISeriesApi<SeriesType, HorzScaleItem> | null = null;
  private _chart: IChartApiBase<HorzScaleItem> | null = null;
  private _requestUpdate?: () => void;
  /** 自动缩放边距是否失效，需要重新计算 */
  private _autoScaleMarginsInvalidated: boolean = true;
  private _autoScaleMargins: AutoScaleMargins | null = null;
  private _markersPositions: MarkerPositions | null = null;
  private _cachedBarSpacing: number | null = null;
  /** 是否需要重新计算内部标记索引 */
  private _recalculationRequired: boolean = true;

  /**
   * 当 primitive 附加到系列时被调用，一次性初始化操作
   */
  public attached(param: SeriesAttachedParameter<HorzScaleItem>): void {
    this._recalculateMarkers();
    this._chart = param.chart;
    this._series = param.series;
    this._paneView = new CircleMarkerPaneView(this._series, ensureNotNull(this._chart));
    this._requestUpdate = param.requestUpdate;
    /** 订阅系列数据变化，用于在数据变动时触发重新渲染 */
    this._series.subscribeDataChanged((scope: DataChangedScope) => this._onDataChanged(scope));
    this._recalculationRequired = true;
    this.requestUpdate();
  }

  /**
   * 请求更新图表视图
   */
  public requestUpdate(): void {
    if (this._requestUpdate) {
      this._requestUpdate();
    }
  }

  /**
   * 当 primitive 从系列分离时被调用，清理资源
   */
  public detached(): void {
    if (this._series && this._dataChangedHandler) {
      this._series.unsubscribeDataChanged(this._dataChangedHandler);
    }
    this._series = null;
    this._chart = null;
    this._paneView = null;
    this._dataChangedHandler = null;
  }

  /**
   * 设置用户传入的标记数组，并触发重新计算和渲染
   */
  public setMarkers(markers: CircleMarker<HorzScaleItem>[]): void {
    this._recalculationRequired = true;
    this._markers = markers;
    this._recalculateMarkers();
    this._autoScaleMarginsInvalidated = true;
    this._markersPositions = null;
    this.requestUpdate();
  }

  public markers(): readonly CircleMarker<HorzScaleItem>[] {
    return this._markers;
  }

  public paneViews(): readonly IPrimitivePaneView[] {
    return this._paneView ? [this._paneView] : [];
  }

  /**
   * 强制更新所有视图
   */
  public updateAllViews(): void {
    this._updateAllViews();
  }

  /**
   * 点击检测，将坐标传给 PaneView 的 hitTest
   */
  public hitTest(x: number, y: number): PrimitiveHoveredItem | null {
    if (this._paneView) {
      return this._paneView.renderer()?.hitTest(x, y) ?? null;
    }
    return null;
  }

  /**
   * 提供给图表的自动缩放接口，返回上下边距配置
   */
  public autoscaleInfo(startTimePoint: Logical, endTimePoint: Logical): AutoscaleInfo | null {
    if (this._paneView) {
      const margins = this._getAutoScaleMargins();
      if (margins) {
        return {
          priceRange: null,
          margins: margins,
        };
      }
    }
    return null;
  }

  /**
   * 计算并缓存自动缩放的上下边距
   */
  private _getAutoScaleMargins(): AutoScaleMargins | null {
    const chart = ensureNotNull(this._chart);
    const barSpacing = chart.timeScale().options().barSpacing;
    // 当 barSpacing 或标记集变化时重新计算
    if (this._autoScaleMarginsInvalidated || barSpacing !== this._cachedBarSpacing) {
      this._cachedBarSpacing = barSpacing;
      if (this._markers.length > 0) {
        const shapeMargin = calcShapeMargin(barSpacing);
        // 计算形状高度 * 1.5 + margin * 2，作为基础边距
        const marginValue = calcShapeHeight(barSpacing) * 1.5 + shapeMargin * 2;
        // 根据标记位置统计哪些位置有标记
        const positions = this._getMarkerPositions();

        this._autoScaleMargins = {
          above: calcAdjustedMargin(marginValue, positions.aboveBar, positions.inBar),
          below: calcAdjustedMargin(marginValue, positions.belowBar, positions.inBar),
        };
      } else {
        this._autoScaleMargins = null;
      }

      this._autoScaleMarginsInvalidated = false;
    }

    return this._autoScaleMargins;
  }

  /**
   * 统计当前标记中有哪些位置类型，用于自动缩放判断
   */
  private _getMarkerPositions(): MarkerPositions {
    if (this._markersPositions === null) {
      this._markersPositions = this._markers.reduce(
        (acc: MarkerPositions, marker: CircleMarker<HorzScaleItem>) => {
          if (!acc[marker.position]) {
            acc[marker.position] = true;
          }
          return acc;
        },
        {
          inBar: false,
          aboveBar: false,
          belowBar: false,
          atPriceTop: false,
          atPriceBottom: false,
          atPriceMiddle: false,
        },
      );
    }
    return this._markersPositions;
  }

  /**
   * 将用户传入的标记列表转换为带实际时间索引的内部标记数组供渲染器使用
   */
  private _recalculateMarkers(): void {
    if (!this._recalculationRequired || !this._chart || !this._series) {
      return;
    }
    const timeScale = this._chart.timeScale();
    const seriesData = this._series?.data();
    // 只有当可视范围和数据都有效时才计算
    if (timeScale.getVisibleLogicalRange() == null || !this._series || seriesData.length === 0) {
      this._indexedMarkers = [];
      return;
    }

    // 获取第一个数据点的逻辑索引，用于确定搜索方向
    const firstDataIndex = timeScale.timeToIndex(
      ensureNotNull(seriesData[0].time),
      true,
    ) as unknown as Logical;
    this._indexedMarkers = this._markers.map<InternalCircleMarker<TimePointIndex>>(
      (marker, index) => {
        // 将 Marker.time 转为最近的逻辑索引
        const timePointIndex = timeScale.timeToIndex(marker.time, true) as unknown as Logical;
        // 如果在第一个数据点之前，用最近右，否则最近左
        const searchMode =
          timePointIndex < firstDataIndex
            ? MismatchDirection.NearestRight
            : MismatchDirection.NearestLeft;
        const seriesDataByIndex = ensureNotNull(this._series).dataByIndex(
          timePointIndex,
          searchMode,
        );
        // 重新获取确定后的 TimePointIndex
        const finalIndex = timeScale.timeToIndex(
          ensureNotNull(seriesDataByIndex).time,
          false,
        ) as unknown as TimePointIndex;

        // 构造内部 marker
        const baseMarker: InternalCircleMarker<TimePointIndex> = {
          time: finalIndex,
          position: marker.position,
          id: marker.id,
          internalId: index,
          size: marker.size,
          originalTime: marker.time,
          text: marker.text,
        };

        return baseMarker as InternalCircleMarker<TimePointIndex>;
      },
    );
    this._recalculationRequired = false;
  }

  public _updateAllViews(updateType?: UpdateType): void {
    if (this._paneView) {
      this._recalculateMarkers();
      this._paneView.setMarkers(this._indexedMarkers);
      this._paneView.update(updateType);
    }
  }

  /**
   * 系列数据变化回调，触发重新计算和更新
   */
  private _onDataChanged(scope: DataChangedScope): void {
    this._recalculationRequired = true;
    this.requestUpdate();
  }
}

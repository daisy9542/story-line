import { ISeriesApi, ISeriesPrimitiveWrapper, SeriesType } from "lightweight-charts";
import { CircleMarker } from "./i-circle-markers";
import { CircleMarkerPrimitive } from "./primitive";
import { SeriesPrimitiveAdapter } from "./series-primitive-adapter";

/**
 * Interface for a series markers plugin
 */
export interface ICircleMarkersPluginApi<HorzScaleItem>
  extends ISeriesPrimitiveWrapper<HorzScaleItem> {
  /**
   * Set markers to the series.
   * @param markers - An array of markers to be displayed on the series.
   */
  setMarkers: (markers: CircleMarker<HorzScaleItem>[]) => void;
  /**
   * Returns current markers.
   */
  markers: () => readonly CircleMarker<HorzScaleItem>[];
  /**
   * Detaches the plugin from the series.
   */
  detach: () => void;
}

class CircleMarkersPrimitiveWrapper<HorzScaleItem>
  extends SeriesPrimitiveAdapter<HorzScaleItem, unknown, CircleMarkerPrimitive<HorzScaleItem>>
  implements ISeriesPrimitiveWrapper<HorzScaleItem>, ICircleMarkersPluginApi<HorzScaleItem>
{
  public constructor(
    series: ISeriesApi<SeriesType, HorzScaleItem>,
    primitive: CircleMarkerPrimitive<HorzScaleItem>,
    markers?: CircleMarker<HorzScaleItem>[],
  ) {
    super(series, primitive);
    if (markers) {
      this.setMarkers(markers);
    }
  }
  public setMarkers(markers: CircleMarker<HorzScaleItem>[]): void {
    this._primitive.setMarkers(markers);
  }

  public markers(): readonly CircleMarker<HorzScaleItem>[] {
    return this._primitive.markers();
  }
}

/**
 * A function to create a series markers primitive.
 *
 * @param series - The series to which the primitive will be attached.
 *
 * @param markers - An array of markers to be displayed on the series.
 *
 * @example
 * ```js
 * import { createCircleMarkers } from 'lightweight-charts';
 *
 *	const seriesMarkers = createCircleMarkers(
 *		series,
 *		[
 *			{
 *				color: 'green',
 *				position: 'inBar',
 * 				shape: 'arrowDown',
 *				time: 1556880900,
 *			},
 *		]
 *	);
 *  // and then you can modify the markers
 *  // set it to empty array to remove all markers
 *  seriesMarkers.setMarkers([]);
 *
 *  // `seriesMarkers.markers()` returns current markers
 * ```
 */
export function createCircleMarkers<HorzScaleItem>(
  series: ISeriesApi<SeriesType, HorzScaleItem>,
  markers?: CircleMarker<HorzScaleItem>[],
): ICircleMarkersPluginApi<HorzScaleItem> {
  const wrapper = new CircleMarkersPrimitiveWrapper(
    series,
    new CircleMarkerPrimitive<HorzScaleItem>(),
  );
  if (markers) {
    wrapper.setMarkers(markers);
  }
  return wrapper;
}

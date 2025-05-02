import {
  IPrimitivePaneView,
  ISeriesApi,
  Time,
  AutoscaleInfo,
  SeriesOptionsMap,
  DataChangedScope,
} from "lightweight-charts";
import { RenderItem, CircleMarkerRenderer } from "./renderer";
import { CircleMarker } from "./i-circle-markers";
import { PluginBase } from "./plugin-base";
import { CircleMarkerPlugin } from "./circle-marker-plugin";

export class CircleMarkerPaneView implements IPrimitivePaneView {
  _source: CircleMarkerPlugin;
  _renderer: CircleMarkerRenderer;

  constructor(source: CircleMarkerPlugin) {
    this._source = source;
    this._renderer = new CircleMarkerRenderer();
  }

  update() {
    const data: RenderItem[] = [];
    const ts = this._source._chart?.timeScale();
    if (!ts) return;
    for (const marker of this._source._markers.values()) {
      const x = ts.timeToCoordinate(marker.time as Time);
      const y = this._source
        .series()
        .priceToCoordinate(marker.priceHigh)
        ?.valueOf();

      if (!x || !y) continue;
      data.push({
        x,
        y,
        position: marker.position,
      });
    }

    this._renderer.update(data);
  }

  renderer() {
    return this._renderer;
  }
}

export class CircleMarkerPrimitive extends PluginBase {
  _source: CircleMarkerPlugin;
  _views: CircleMarkerPaneView[];

  constructor(source: CircleMarkerPlugin) {
    super();
    this._source = source;
    this._views = [new CircleMarkerPaneView(this._source)];
  }

  requestUpdate(): void {
    super.requestUpdate();
  }

  updateAllViews(): void {
    this._views.forEach((view) => view.update());
  }

  paneViews(): IPrimitivePaneView[] {
    return this._views;
  }
}

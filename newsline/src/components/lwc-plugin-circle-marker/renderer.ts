import { CanvasRenderingTarget2D } from "fancy-canvas";
import { IPrimitivePaneRenderer } from "lightweight-charts";
import { positionsLine } from "./helper";

export interface RenderItem {
  x: number;
  y: number;
  position: "aboveBar" | "belowBar";
}

export class CircleMarkerRenderer implements IPrimitivePaneRenderer {
  _items: RenderItem[] = [];

  update(items: RenderItem[]) {
    this._items = items;
  }

  draw(target: CanvasRenderingTarget2D) {
    let pixelRatio = 1; // 适应不同的设备像素比
    target.useBitmapCoordinateSpace((scope) => {
      pixelRatio = scope.verticalPixelRatio;
    });
    target.useMediaCoordinateSpace((scope) => {
      const ctx = scope.context;
      this._items.forEach((item) => {
        const priceLineY = positionsLine(item.y, pixelRatio);
        const priceY =
          (priceLineY.position + priceLineY.length / 2) / pixelRatio;
        ctx.beginPath();
        ctx.arc(item.x, 50 + priceY, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fill();
        ctx.closePath();
      });
    });
  }
}

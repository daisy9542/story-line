import { CanvasRenderingTarget2D } from "fancy-canvas";
import {
  Coordinate,
  IPrimitivePaneRenderer,
  IRange,
  PrimitiveHoveredItem,
} from "lightweight-charts";
import { shapeSize } from "./helper/utils";
import { TimedValue } from "./i-circle-markers";

export interface RenderItem extends TimedValue {
  y: Coordinate;
  size: number;
  imgUrl?: string;
  text?: string;
  internalId: number;
  externalId?: string;
  hovered: boolean;
}

export interface RenderData {
  items: RenderItem[];
  visibleRange: IRange<number> | null;
}

export class CircleMarkerRenderer implements IPrimitivePaneRenderer {
  private _data: RenderData | null = null;
  private _fontSize: number = -1;
  private _fontFamily: string = "";
  private _font: string = "";

  public setData(data: RenderData): void {
    this._data = data;
  }

  public setParams(fontSize: number, fontFamily: string): void {
    if (this._fontSize !== fontSize || this._fontFamily !== fontFamily) {
      this._fontSize = fontSize;
      this._fontFamily = fontFamily;
      this._font = `${fontSize}px ${fontFamily}`;
    }
  }

  draw(target: CanvasRenderingTarget2D): void {
    target.useBitmapCoordinateSpace((scope) => {
      if (this._data === null || this._data.visibleRange === null) {
        return;
      }
      const { context: ctx, horizontalPixelRatio: hpr, verticalPixelRatio: vpr } = scope;
      // 计算在当前像素比下，每根 bar 的实际宽度（至少 1 像素）
      const tickWidth = Math.max(1, Math.floor(hpr));
      // 如果 tickWidth 为奇数，则 correction 为 0.5，用于将绘制位置对齐到像素中心，避免模糊
      const correction = (tickWidth % 2) / 2;

      // 文本样式
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const _drawImpl = (item: RenderItem) => {
        if (!item || item.size === 0) {
          return;
        }
        const cx = Math.round(item.x * hpr) + correction;
        const cy = Math.round(item.y * vpr);
        const radius = ((shapeSize(item.size) - 1) / 2) * hpr;

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        if (item.hovered) {
          ctx.save();
          ctx.lineWidth = 2 * hpr;
          ctx.strokeStyle = "rgba(30,144,255,0.9)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();
        }

        // 圆内切正方形边长，0.9 是留白，防止贴边
        if (item.text) {
          const maxTextWidth = radius * Math.SQRT2 * 0.9;
          let fontSize = Math.floor(radius * 0.8);
          let textWidth: number;
          do {
            ctx.font = this._font;
            textWidth = ctx.measureText(item.text).width;
            if (textWidth <= maxTextWidth) {
              break;
            }
            fontSize--;
          } while (fontSize > 1);

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
          ctx.clip();

          ctx.fillStyle = "black";
          ctx.fillText(item.text, cx, cy);
          ctx.restore();
        }
      };

      let hoveredItemIdx = -1;
      for (let index = this._data.visibleRange.from; index < this._data.visibleRange.to; index++) {
        const item = this._data.items[index];
        if (item.hovered) {
          hoveredItemIdx = index;
          continue;
        }
        _drawImpl(item);
      }
      // 确保 hovered 的标记被绘制在最上层
      _drawImpl(this._data.items[hoveredItemIdx]);
    });
  }

  public hitTest(x: number, y: number): PrimitiveHoveredItem | null {
    if (this._data === null || this._data.visibleRange === null) {
      return null;
    }

    for (let i = this._data.visibleRange.from; i < this._data.visibleRange.to; i++) {
      const item = this._data.items[i];
      if (item && hitTestShape(item, x as Coordinate, y as Coordinate)) {
        return {
          zOrder: "normal",
          externalId: item.externalId ?? "",
          cursorStyle: "pointer",
        };
      }
    }

    return null;
  }
}

/**
 * 检测图形是否被点击
 */
function hitTestShape(item: RenderItem, x: Coordinate, y: Coordinate): boolean {
  if (item.size === 0) {
    return false;
  }
  const circleSize = shapeSize(item.size);
  const tolerance = 2 + circleSize / 2;
  const xOffset = item.x - x;
  const yOffset = item.y - y;
  const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
  return dist <= tolerance;
}

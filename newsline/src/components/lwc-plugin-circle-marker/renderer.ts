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
  focused?: boolean; // 是否为点击聚焦状态
  isAggregated?: boolean; // 是否为聚合标记
  aggregatedCount?: number; // 聚合的标记数量
  icon?: string; // 图标URL
  influence?: number; // 影响力值，用于调整大小
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
  private _iconCache: Map<string, HTMLImageElement> = new Map(); // 图标缓存
  private _updateCallback?: () => void; // 更新回调
  private _debugLogged: boolean = false; // 调试标志

  public setData(data: RenderData): void {
    this._data = data;
    // 预加载图标
    this._preloadIcons();
  }

  public setUpdateCallback(callback: () => void): void {
    this._updateCallback = callback;
  }

  /**
   * 预加载图标
   */
  private _preloadIcons(): void {
    if (!this._data) return;
    
    this._data.items.forEach((item) => {
      if (item.icon && !this._iconCache.has(item.icon)) {
        const img = new Image();
        
        img.onload = () => {
          this._iconCache.set(item.icon!, img);
          // 图标加载完成后，触发重新渲染
          if (this._updateCallback) {
            this._updateCallback();
          }
        };
        
        img.onerror = (error) => {
          console.warn('SVG图标加载失败:', item.icon, error);
        };
        
        img.src = item.icon;
      }
    });
  }

  /**
   * 根据影响力计算大小倍数
   */
  private _calculateInfluenceMultiplier(influence?: number): number {
    if (!influence) return 1;
    // 将0-100的影响力映射到0.8-1.2的大小倍数，减少差异
    const normalizedInfluence = Math.max(0, Math.min(100, influence)) / 100;
    return 0.8 + normalizedInfluence * 0.4; // 0.8x 到 1.2x
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
        
        // 根据影响力调整大小
        const influenceMultiplier = this._calculateInfluenceMultiplier(item.influence);
        const baseRadius = ((shapeSize(item.size) - 1) / 2) * hpr;
        const radius = baseRadius * influenceMultiplier;

        // 所有标记使用相同的样式
        const isAggregated = item.isAggregated || false;
        const textColor = "black";
        const hasIcon = item.icon && this._iconCache.has(item.icon);

        // 绘制主圆形 - 统一使用白色
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        // 绘制边框 - 统一使用灰色
        ctx.beginPath();
        ctx.strokeStyle = "#E0E0E0";
        ctx.lineWidth = 1 * hpr;
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.stroke();

        // 悬停和聚焦效果
        if (item.hovered || item.focused) {
          ctx.save();
          
          // 外层光晕效果
          const glowRadius = radius + 8;
          const gradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, glowRadius);
          gradient.addColorStop(0, "rgba(30,144,255,0.3)");
          gradient.addColorStop(1, "rgba(30,144,255,0)");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, glowRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 强化边框 - 聚焦状态使用更强的效果
          ctx.lineWidth = item.focused ? 4 * hpr : 3 * hpr;
          ctx.strokeStyle = item.focused ? "rgba(30,144,255,1)" : "rgba(30,144,255,0.8)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
          ctx.stroke();
          
          // 内层高亮
          ctx.lineWidth = 1 * hpr;
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius - 2, 0, 2 * Math.PI);
          ctx.stroke();
          
          ctx.restore();
        }

        // 绘制图标或文本
        if (item.icon) {
          // 优先显示图标
          const iconImg = this._iconCache.get(item.icon);
          

          
          if (iconImg && iconImg.complete) {
            const iconSize = radius * 1.4; // 图标大小为圆形直径的70%，确保不超出边界
            const iconX = cx - iconSize / 2;
            const iconY = cy - iconSize / 2;
            
            ctx.save();
            // 创建圆形裁剪区域
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 2, 0, 2 * Math.PI); // 稍微缩小裁剪区域，避免边缘问题
            ctx.clip();
            
            // 绘制图标
            ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
            ctx.restore();
          } else {
            // 图标未加载完成时，显示文本作为降级
            if (item.text) {
              const maxTextWidth = radius * Math.SQRT2 * 0.9;
              let fontSize = Math.floor(radius * 0.8);
              let textWidth: number;
              
              do {
                ctx.font = `${fontSize}px ${this._fontFamily}`;
                textWidth = ctx.measureText(item.text).width;
                if (textWidth <= maxTextWidth) {
                  break;
                }
                fontSize--;
              } while (fontSize > 8);

              ctx.save();
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
              ctx.clip();

              ctx.fillStyle = textColor;
              ctx.font = `${fontSize}px ${this._fontFamily}`;
              ctx.fillText(item.text, cx, cy);
              ctx.restore();
            }
          }
        } else if (item.text) {
          // 没有图标时显示文本
          const maxTextWidth = radius * Math.SQRT2 * 0.9;
          let fontSize = Math.floor(radius * 0.8);
          let textWidth: number;
          
          do {
            ctx.font = `${fontSize}px ${this._fontFamily}`;
            textWidth = ctx.measureText(item.text).width;
            if (textWidth <= maxTextWidth) {
              break;
            }
            fontSize--;
          } while (fontSize > 8); // 最小字体大小

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
          ctx.clip();

          ctx.fillStyle = textColor;
          ctx.font = `${fontSize}px ${this._fontFamily}`;
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
  
  // 考虑影响力调整后的大小
  const influenceMultiplier = item.influence ? 
    (0.8 + (Math.max(0, Math.min(100, item.influence)) / 100) * 0.4) : 1;
  const baseCircleSize = shapeSize(item.size);
  const actualCircleSize = baseCircleSize * influenceMultiplier;
  
  const tolerance = 2 + actualCircleSize / 2;
  const xOffset = item.x - x;
  const yOffset = item.y - y;
  const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
  return dist <= tolerance;
}

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
  private _iconCache: Map<string, HTMLImageElement | null> = new Map(); // 图标缓存
  private _updateCallback?: () => void; // 更新回调
  private _debugLogged: boolean = false; // 调试标志
  
  // 动画相关属性
  private _animationStartTime: number = 0;
  private _animationDuration: number = 200; // 200ms动画时长
  private _animationFrame: number | null = null;
  private _hoveredItems: Set<string> = new Set(); // 跟踪悬停状态的项目
  private _focusedItems: Set<string> = new Set(); // 跟踪聚焦状态的项目

  public setData(data: RenderData): void {
    this._data = data;
    console.log('设置渲染数据，项目数量:', data.items.length);
    data.items.forEach((item, index) => {
      console.log(`项目 [${index}]:`, {
        id: item.externalId,
        hasIcon: !!item.icon,
        iconUrl: item.icon,
        text: item.text
      });
    });
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
    
    this._data.items.forEach((item, index) => {
      if (item.icon && !this._iconCache.has(item.icon)) {
        console.log(`开始加载图标 [${index}]:`, item.icon);
        const img = new Image();
        
        // 设置超时时间
        const timeout = setTimeout(() => {
          console.warn(`图标加载超时 [${index}]:`, item.icon);
          this._iconCache.set(item.icon!, null as HTMLImageElement | null);
        }, 10000); // 10秒超时
        
        img.onload = () => {
          clearTimeout(timeout);
          console.log(`图标加载成功 [${index}]:`, item.icon, `尺寸: ${img.width}x${img.height}`);
          this._iconCache.set(item.icon!, img);
          // 图标加载完成后，触发重新渲染
          if (this._updateCallback) {
            this._updateCallback();
          }
        };
        
        img.onerror = (error) => {
          clearTimeout(timeout);
          console.error(`图标加载失败 [${index}]:`, item.icon, error);
          
          // 尝试使用跨域属性重新加载
          const img2 = new Image();
          img2.crossOrigin = "anonymous";
          
          const timeout2 = setTimeout(() => {
            console.warn(`图标重新加载超时 [${index}]:`, item.icon);
            this._iconCache.set(item.icon!, null as HTMLImageElement | null);
          }, 5000);
          
          img2.onload = () => {
            clearTimeout(timeout2);
            console.log(`图标重新加载成功 [${index}]:`, item.icon);
            this._iconCache.set(item.icon!, img2);
            if (this._updateCallback) {
              this._updateCallback();
            }
          };
          
          img2.onerror = (error2) => {
            clearTimeout(timeout2);
            console.error(`图标重新加载也失败 [${index}]:`, item.icon, error2);
            // 加载失败时，在缓存中标记为null，避免重复尝试
            this._iconCache.set(item.icon!, null as HTMLImageElement | null);
          };
          
          img2.src = item.icon!;
        };
        
        // 先尝试不设置跨域属性
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
        
        // 悬停时轻微放大，聚焦时保持放大
        let scaleMultiplier = 1;
        if (item.focused) {
          scaleMultiplier = 1.15; // 聚焦时放大15%
        } else if (item.hovered) {
          scaleMultiplier = 1.08; // 悬停时放大8%
        }
        
        const radius = baseRadius * influenceMultiplier * 0.5 * scaleMultiplier;

        // 所有标记使用相同的样式
        const textColor = "black";

        // 添加微妙的阴影效果
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
        ctx.shadowBlur = 3 * hpr;
        ctx.shadowOffsetY = 1 * vpr;

        // 只有在没有图标或图标加载失败时才绘制白色背景
        const iconImg = item.icon ? this._iconCache.get(item.icon) : null;
        const hasValidIcon = iconImg && iconImg.complete && iconImg !== null;
        
        if (!hasValidIcon) {
          // 绘制主圆形 - 统一使用白色
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
          ctx.fill();
        }
        ctx.restore();

        // 绘制边框 - 统一使用灰色
        ctx.beginPath();
        ctx.strokeStyle = "#E0E0E0";
        ctx.lineWidth = 0.5 * hpr;
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
        ctx.stroke();

        // 悬停和聚焦效果 - 区分两种状态
        if (item.focused) {
          // 聚焦状态：金色边框 + 稳定光晕
          ctx.save();
          
          // 金色光晕效果
          const glowRadius = radius + 6;
          const gradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, glowRadius);
          gradient.addColorStop(0, "rgba(255,193,7,0.4)");
          gradient.addColorStop(1, "rgba(255,193,7,0)");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, glowRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 金色边框
          ctx.lineWidth = 2 * hpr;
          ctx.strokeStyle = "rgba(255,193,7,0.9)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 1, 0, 2 * Math.PI);
          ctx.stroke();
          
          // 内层高亮
          ctx.lineWidth = 1 * hpr;
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius - 1, 0, 2 * Math.PI);
          ctx.stroke();
          
          ctx.restore();
        } else if (item.hovered) {
          // 悬停状态：蓝色边框 + 轻微光晕
          ctx.save();
          
          // 蓝色光晕效果
          const glowRadius = radius + 4;
          const gradient = ctx.createRadialGradient(cx, cy, radius, cx, cy, glowRadius);
          gradient.addColorStop(0, "rgba(30,144,255,0.2)");
          gradient.addColorStop(1, "rgba(30,144,255,0)");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(cx, cy, glowRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 蓝色边框
          ctx.lineWidth = 1.5 * hpr;
          ctx.strokeStyle = "rgba(30,144,255,0.7)";
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 1, 0, 2 * Math.PI);
          ctx.stroke();
          
          ctx.restore();
        }

        // 绘制图标或文本
        if (item.icon) {
          // 优先显示图标
          const iconImg = this._iconCache.get(item.icon);
          console.log('检查图标:', item.icon, '缓存状态:', !!iconImg, '完成状态:', iconImg?.complete, '非空:', iconImg !== null);
          
          if (iconImg && iconImg.complete && iconImg !== null) {
            ctx.save();
            
            // 创建圆形裁剪区域，让图标填充整个圆形
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 1, 0, 2 * Math.PI); // 稍微缩小1px避免边缘问题
            ctx.clip();
            
            // 计算图标尺寸，让它完全填充圆形
            const iconSize = radius * 2; // 图标大小为圆形直径
            const iconX = cx - iconSize / 2;
            const iconY = cy - iconSize / 2;
            
            // 绘制图标，填充整个圆形区域
            ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
            ctx.restore();
            
            // 如果是聚合泡泡，在图标上方添加半透明遮罩以便数字更清晰
            if (item.isAggregated && item.aggregatedCount && item.aggregatedCount > 1) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(cx, cy, radius - 1, 0, 2 * Math.PI);
              ctx.clip();
              
              // 添加半透明白色遮罩
              ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
              ctx.beginPath();
              ctx.arc(cx, cy, radius - 1, 0, 2 * Math.PI);
              ctx.fill();
              ctx.restore();
            }
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

        // 绘制聚合数量标识
        if (item.isAggregated && item.aggregatedCount && item.aggregatedCount > 1) {
          const badgeRadius = Math.max(8, radius * 0.3);
          const badgeX = cx + radius - badgeRadius * 0.7;
          const badgeY = cy - radius + badgeRadius * 0.7;
          
          // 绘制小圆形背景
          ctx.save();
          ctx.fillStyle = "rgba(255, 87, 87, 0.9)"; // 红色背景
          ctx.beginPath();
          ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI);
          ctx.fill();
          
          // 绘制白色边框
          ctx.strokeStyle = "white";
          ctx.lineWidth = 1.5 * hpr;
          ctx.stroke();
          
          // 绘制数字
          const badgeFontSize = Math.max(8, badgeRadius * 1.2);
          ctx.fillStyle = "white";
          ctx.font = `bold ${badgeFontSize}px ${this._fontFamily}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.aggregatedCount.toString(), badgeX, badgeY);
          
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
  
  // 考虑悬停和聚焦状态的放大效果
  let scaleMultiplier = 1;
  if (item.focused) {
    scaleMultiplier = 1.15; // 聚焦时放大15%
  } else if (item.hovered) {
    scaleMultiplier = 1.08; // 悬停时放大8%
  }
  
  const actualCircleSize = baseCircleSize * influenceMultiplier * 0.5 * scaleMultiplier; // 与渲染大小保持一致
  
  const tolerance = 2 + actualCircleSize / 2;
  const xOffset = item.x - x;
  const yOffset = item.y - y;
  const dist = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
  return dist <= tolerance;
}

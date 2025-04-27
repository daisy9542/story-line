"use client";

import React, {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useKolStore } from "@/stores/kol-store";
import * as d3 from "d3";
import ForceGraph2D, {
  type ForceGraphMethods,
  type LinkObject,
  type NodeObject,
} from "react-force-graph-2d";

import type { ForceGraphHandle, GraphLink, GraphNode } from "@/types/graph";
import { getNodeColor } from "@/lib/utils";

interface ForceGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

/**
 * 计算节点的半径
 *
 * @param percentage 粉丝数百分比
 * @returns 半径
 */
const getRadius = (percentage: number) =>
  Math.min(100, 30.2 * Math.sqrt(percentage) + 2);

/**
 * 截断文本以适应指定的最大宽度
 *
 * @param ctx CanvasRenderingContext2D 上下文
 * @param text 原始文本
 * @param maxWidth 最大宽度
 * @returns 截断后的文本
 */
const truncateTextToFit = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string => {
  let truncated = text;
  while (ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + (truncated.length < text.length ? "..." : "");
};

const ForceGraph = forwardRef(function ForceGraph(
  { nodes, links }: ForceGraphProps,
  ref: Ref<ForceGraphHandle | null>,
) {
  const { selectedKol, targetKol, setSelectedKol, setTargetKol } =
    useKolStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef =
    useRef<
      ForceGraphMethods<NodeObject<GraphNode>, LinkObject<GraphNode, GraphLink>>
    >(undefined);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const kolMap = new Map<string, GraphNode>();
  const [hoveredNode, setHoveredNode] = useState<NodeObject<GraphNode> | null>(
    null,
  );

  let dashOffset = 0;
  nodes.forEach((node) => {
    kolMap.set(node.id, node);
  });

  useImperativeHandle(ref, () => fgRef.current!, [fgRef.current]);

  // 用 ResizeObserver 监听容器尺寸
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !fgRef.current) return;
    const sim = fgRef.current;
    sim.d3Force(
      "link",
      d3
        .forceLink<GraphNode, GraphLink>()
        .id((d) => d.id)
        .distance(80)
        .strength(0.5),
    );
    sim.d3Force("charge", d3.forceManyBody().strength(-150));
    sim.d3Force("center", d3.forceCenter(0, 0));
    sim.d3Force(
      "radial",
      d3.forceRadial<GraphNode>(
        (d) => 100 + 100 * (1 - d.percentage / 100),
        0,
        0,
      ),
    );
    sim.d3Force(
      "collision",
      d3
        .forceCollide<GraphNode>()
        .radius((d) => getRadius(d.percentage) + 4)
        .strength(1),
    );
  }, [containerRef.current, fgRef.current, nodes, links]);

  useEffect(() => {
    if (!selectedKol || !fgRef.current || targetKol) return;

    // 查找选中的节点
    const nodeToFocus = nodes.find((node) => node.id === selectedKol.id);
    if (nodeToFocus && fgRef.current) {
      // 使用 centerAt 聚焦到指定节点的坐标
      fgRef.current.centerAt(nodeToFocus.x, nodeToFocus.y, 1000); // 1000 是平滑过渡的时间（毫秒）
    }
  }, [selectedKol, nodes]);

  return (
    <div
      ref={containerRef}
      className="relative left-0 top-0 z-10 h-full w-full"
    >
      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D
          ref={fgRef}
          width={size.width}
          height={size.height}
          graphData={{ nodes, links }}
          backgroundColor="#101827"
          d3AlphaDecay={
            links.length > 1e3
              ? 0.9
              : links.length > 800
                ? 0.8
                : links.length > 600
                  ? 0.7
                  : links.length > 400
                    ? 0.1
                    : links.length > 300
                      ? 0.05
                      : 0.0228
          }
          nodeCanvasObject={(node, ctx, scale) => {
            if (!node.x || !node.y) return;
            const isSelected = !targetKol && node.id === selectedKol?.id;
            const isHovered = hoveredNode === node;
            const radius = getRadius(node.percentage);
            const { fillColor, strokeColor } =
              isSelected || isHovered
                ? { fillColor: "rgba(255,255,255,0.2)", strokeColor: "#ffffff" }
                : getNodeColor(node.score_metrics ?? 0, node.opacity ?? 1);

            const label = node.name ?? node.id;
            const lineWidth = isSelected ? 4 : isHovered ? 3 : 2;

            // 圆形
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = fillColor;
            ctx.fill();

            // 边框
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle =
              node.id === selectedKol?.id ? "#ffffff" : strokeColor;
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            // 文本（缩小时隐藏）
            const selected = node.id === selectedKol?.id;
            if ((node.isTop && radius > 25 && scale > 0.35) || selected) {
              const fontSize = 12;
              const text = selected
                ? label
                : truncateTextToFit(ctx, label, radius * 2 - 12);

              ctx.font = `${fontSize / scale}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";

              const textWidth = ctx.measureText(text).width;
              const padding = 4;

              // 背景框（淡黑半透明），防止文字看不清
              if (selected) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
                ctx.fillRect(
                  node.x - textWidth / 2 - padding,
                  node.y - fontSize / (2 * scale),
                  textWidth + padding * 2,
                  fontSize / scale + 4,
                );
              }

              ctx.fillStyle = "#ffffff";
              ctx.fillText(text, node.x, node.y);
            }
          }}
          linkCanvasObject={(link, ctx) => {
            const source = link.source as GraphNode;
            const target = link.target as GraphNode;
            if (
              !source ||
              !target ||
              !source.x ||
              !target.x ||
              !source.y ||
              !target.y
            )
              return;

            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const angle = Math.atan2(dy, dx);

            const forward = link.source2target_score ?? 0;
            const backward = link.target2source_score ?? 0;

            const isBidirectional = forward > 0 && backward > 0;
            const arrowLength = 8;
            const radius = 4;

            // 颜色
            const sColor = getNodeColor(forward, 1).strokeColor;
            const tColor = getNodeColor(backward, 1).strokeColor;

            // 起点略缩，避免压住节点
            const startX = source.x + Math.cos(angle) * radius;
            const startY = source.y + Math.sin(angle) * radius;
            const endX = target.x - Math.cos(angle) * (radius + arrowLength);
            const endY = target.y - Math.sin(angle) * (radius + arrowLength);
            const dist = Math.hypot(endX - startX, endY - startY);
            if (dist < 2) return;

            let strokeStyle: CanvasGradient | string;
            let dash: number[] = [];

            // 渐变（双向）
            if (isBidirectional) {
              // 在双向情况下用 source -> target 坐标创建渐变
              const grad = ctx.createLinearGradient(startX, startY, endX, endY);
              const sColor = getNodeColor(forward, 1).strokeColor;
              const tColor = getNodeColor(backward, 1).strokeColor;
              grad.addColorStop(0, sColor);
              grad.addColorStop(1, tColor);
              strokeStyle = grad;
              dash = []; // 实线
            } else {
              // 单向用虚线 + 单色
              strokeStyle =
                forward > 0
                  ? getNodeColor(forward, 1).strokeColor
                  : getNodeColor(backward, 1).strokeColor;
              dash = [6, 4];
            }

            // 渲染线条
            ctx.save();
            ctx.setLineDash(dash);
            ctx.lineDashOffset = dashOffset;
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = strokeStyle;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();

            // 箭头（仅单向显示）
            const drawArrow = (
              x: number,
              y: number,
              angle: number,
              color: string,
            ) => {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(
                x - Math.cos(angle - Math.PI / 8) * arrowLength,
                y - Math.sin(angle - Math.PI / 8) * arrowLength,
              );
              ctx.lineTo(
                x - Math.cos(angle + Math.PI / 8) * arrowLength,
                y - Math.sin(angle + Math.PI / 8) * arrowLength,
              );
              ctx.closePath();
              ctx.fillStyle = color;
              ctx.fill();
            };

            if (forward > 0) {
              // source → target
              const arrowX = target.x - Math.cos(angle) * radius;
              const arrowY = target.y - Math.sin(angle) * radius;
              drawArrow(arrowX, arrowY, angle, sColor);
            }

            if (backward > 0) {
              // target → source
              const reverseAngle = angle + Math.PI;
              const arrowX = source.x - Math.cos(reverseAngle) * radius;
              const arrowY = source.y - Math.sin(reverseAngle) * radius;
              drawArrow(arrowX, arrowY, reverseAngle, tColor);
            }
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            if (!node.x || !node.y) return;
            const radius = getRadius(node.percentage) + 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fill();
          }}
          nodeRelSize={1} // 禁用默认 radius 缩放
          onNodeDragEnd={(node) => {
            node.fx = node.x;
            node.fy = node.y;
          }}
          onNodeHover={(node) => {
            if (node) {
              setHoveredNode(node);
            }
            if (containerRef.current)
              containerRef.current.style.cursor = node ? "pointer" : "";
          }}
          onNodeClick={(node) => {
            setSelectedKol(node);
          }}
          onRenderFramePost={() => {
            dashOffset -= 0.2; // 给单向边添加动画效果
          }}
        />
      )}
    </div>
  );
});

export default ForceGraph;

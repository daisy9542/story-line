import React, { useEffect, useRef } from "react";
import { useKolStore } from "@/stores/kol-store";
import * as d3 from "d3";
import ForceGraph2D, {
  type ForceGraphMethods,
  type LinkObject,
  type NodeObject,
} from "react-force-graph-2d";

import type { ForceLink, ForceNode } from "@/types/graph";

interface ForceGraphProps {
  nodes: ForceNode[];
  links: ForceLink[];
}

const nodeColorPalette = [
  { fill: "#4f46e5", stroke: "#a5b4fc" }, // 深蓝 + 淡蓝
  { fill: "#0e7490", stroke: "#67e8f9" }, // 深青 + 淡青
  { fill: "#9333ea", stroke: "#d8b4fe" }, // 深紫 + 淡紫
  { fill: "#ea580c", stroke: "#fdba74" }, // 深橘 + 淡橘
  { fill: "#1d4ed8", stroke: "#93c5fd" }, // 深蓝2
  { fill: "#be185d", stroke: "#f9a8d4" }, // 深粉 + 粉红
];

const getNodeColor = (id: string) => {
  const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = hash % nodeColorPalette.length;
  return nodeColorPalette[index];
};

const getRadius = (followers: number) => 10 + 3 * Math.log(followers + 1);

export default function ForceGraph({ nodes, links }: ForceGraphProps) {
  const { selectedKolId, setSelectedKolId } = useKolStore();
  const filteredLinks = links.filter((link) => link.score !== 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef =
    useRef<
      ForceGraphMethods<NodeObject<ForceNode>, LinkObject<ForceNode, ForceLink>>
    >(undefined);

  useEffect(() => {
    if (!containerRef.current || !fgRef.current) return;
    // const { width, height } = containerRef.current.getBoundingClientRect();
    // fgRef.current.d3Force("center", d3.forceCenter(width / 2, height / 2));
    const sim = fgRef.current;
    sim.d3Force("center", d3.forceCenter(0, 0));
    sim.d3Force("link")!.distance(160).strength(0.7);
    sim.d3Force("charge")!.strength(-100);
    sim.d3Force(
      "radial",
      d3
        .forceRadial<ForceNode>(
          (d) => {
            const followers = d.followers ?? 0;
            const logScale = Math.log10(followers + 10);
            const norm = Math.min(logScale / 6, 1);
            return 50 + 50 * (1 - norm);
          },
          0,
          0,
        )
        .strength(0.02),
    );
    sim.d3Force(
      "collision",
      d3
        .forceCollide<ForceNode>((d) => {
          return Math.log10((d.followers ?? 0) + 10) * 2;
        })
        .strength(0.8),
    );
  }, [nodes, links, filteredLinks]);

  useEffect(() => {
    if (!selectedKolId || !fgRef.current) return;

    // 查找选中的节点
    const nodeToFocus = nodes.find((node) => node.id === String(selectedKolId));
    if (nodeToFocus && fgRef.current) {
      // 使用 centerAt 聚焦到指定节点的坐标
      fgRef.current.centerAt(nodeToFocus.x, nodeToFocus.y, 1000); // 1000 是平滑过渡的时间（毫秒）
    }
  }, [selectedKolId, nodes]);

  // 点击外部区域的监听
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       containerRef.current &&
  //       !containerRef.current.contains(event.target as Node)
  //     ) {
  //       setSelectedKolId(null);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [setSelectedKolId]);

  return (
    <div ref={containerRef} className="z-1 absolute left-0 top-0 h-full w-full">
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        backgroundColor="#101827"
        nodeCanvasObject={(node, ctx, scale) => {
          if (!node.x || !node.y) return;
          const radius = getRadius(node.followers);
          const { fill, stroke } = getNodeColor(node.id);
          const label = node.name ?? node.id;

          // 圆形
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = fill;
          ctx.fill();

          // 边框
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.strokeStyle =
            node.id === String(selectedKolId) ? "#ffffff" : stroke;
          ctx.lineWidth = node.id === String(selectedKolId) ? 4 : 2;
          ctx.stroke();

          // 文本（缩小时隐藏）
          if (scale > 0.35) {
            const nameLength = label.length;
            const fontSize = Math.min(
              24,
              Math.max(10, Math.min(18, (radius * 1.8) / nameLength)),
            );

            ctx.font = `${fontSize / scale}px sans-serif`;
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, node.x!, node.y!);
          }
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          if (!node.x || !node.y) return;
          const radius = getRadius(node.followers) + 2;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }}
        linkWidth={(link) => {
          const score = link.score ?? 0;
          const minWidth = 1;
          const maxWidth = 6;
          const normalized = Math.min(Math.abs(score) / 100, 1);
          return minWidth + (maxWidth - minWidth) * normalized;
        }}
        linkColor={(link) =>
          link.score > 0
            ? d3.interpolateGreens(Math.min(link.score / 100, 1))
            : d3.interpolateReds(Math.min(-link.score / 100, 1))
        }
        nodeRelSize={1} // 禁用默认 radius 缩放
        onNodeDragEnd={(node) => {
          node.fx = node.x;
          node.fy = node.y;
        }}
        onNodeClick={(node) => {
          console.log("node clicked", node.id, Number(node.id));
          setSelectedKolId(Number(node.id));
        }}
      />
    </div>
  );
}

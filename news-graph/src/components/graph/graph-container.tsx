"use client";

import React, { useEffect, useRef, useState } from "react";
import { GraphEdge, GraphNode, NodeType } from "@/types";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from "react-flow-renderer";

import { getNodeDimensions } from "@/lib/node-dimensions";

import CustomEdge from "./custom-edge";
import NodeRenderer from "./node-renderer";

const nodeTypes = { custom: NodeRenderer };
const edgeTypes = { custom: CustomEdge };

interface GraphContainerProps {
  graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

export default function GraphContainer({ graphData }: GraphContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node<GraphNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // ----------------------------------------------------------------------------
  // 1. effect #1：当 graphData 改变时，"先"做 BFS + normalize + 径向布局 → setNodes
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!graphData) return;
    
    const { nodes: rawNodes, edges: rawEdges } = graphData;

    // —— 1.1 BFS 计算每个节点的 "层级 level" —— //
    function assignLevels(
      rawNodes: { id: string; type: NodeType }[],
      rawEdges: { source: string; target: string }[],
    ): Map<string, number> {
      const levelMap = new Map<string, number>();
      const adj = new Map<string, string[]>();
      rawNodes.forEach((n) => adj.set(n.id, []));
      rawEdges.forEach((e) => {
        if (!adj.has(e.source) || !adj.has(e.target)) return;
        adj.get(e.source)!.push(e.target);
        adj.get(e.target)!.push(e.source);
      });
      const center = rawNodes.find((n) => n.type === NodeType.EVENT && n.id === "main-event");
      if (!center) return levelMap;
      levelMap.set(center.id, 0);
      const queue: string[] = [center.id];
      while (queue.length) {
        const cur = queue.shift()!;
        const lvl = levelMap.get(cur)!;
        for (const nei of adj.get(cur)!) {
          if (!levelMap.has(nei)) {
            levelMap.set(nei, lvl + 1);
            queue.push(nei);
          }
        }
      }
      return levelMap;
    }

    const levelMap = assignLevels(
      rawNodes.map((n) => ({ id: n.id, type: n.type })),
      rawEdges.map((e) => ({ source: e.source, target: e.target })),
    );

    // —— 1.2 normalizeNodes + 附加 level/clusterId/opacity/parallelCount —— //
    let rNodes: GraphNode[] = rawNodes;
    rNodes = rNodes.map((n) => {
      const lvl = levelMap.get(n.id) ?? -1;
      let cId: string;

      // 根据节点类型分配聚类ID
      if (n.type === NodeType.GROUP) cId = "group";
      else if (n.type === NodeType.PERSON) cId = "person";
      else if (n.type === NodeType.ASSETS) cId = "assets";
      else if (n.type === NodeType.EVENT && n.id !== "main-event") cId = "historical-events";
      else if (n.type === NodeType.RELATED_EVENT) cId = "related-events";
      else cId = "center";

      // 并行边数量，用于 NodeRenderer 里决定要渲染多少个 source Handle
      const parallelCount =
        rawEdges.filter((e) => e.source === n.id).length +
          rawEdges.filter((e) => e.target === n.id).length || 1;

      return {
        ...n,
        level: lvl,
        clusterId: cId,
        opacity: lvl === 0 ? 1 : 0.6,
        parallelCount,
      };
    });
    // 如果你不想展示"与中心不连通"的节点，可以 filter 掉 level<0
    // rNodes = rNodes.filter((n) => n.level >= 0);

    // —— 1.3 径向布局：把 rNodes 映射到绝对坐标 (x, y) —— //
    function computeRadialPositions(
      nodesArr: GraphNode[],
      width: number,
      height: number,
    ): { id: string; x: number; y: number }[] {
      const cx = width / 2;
      const cy = height / 2;

      // 按类型分组
      const typeGroups = new Map<NodeType, GraphNode[]>();
      nodesArr.forEach((nd) => {
        if (!typeGroups.has(nd.type)) typeGroups.set(nd.type, []);
        typeGroups.get(nd.type)!.push(nd);
      });

      // 按层级分组
      const levelGroups = new Map<number, GraphNode[]>();
      nodesArr.forEach((nd) => {
        const level = nd.level ?? 0;
        if (!levelGroups.has(level)) levelGroups.set(level, []);
        levelGroups.get(level)!.push(nd);
      });

      const lvls = Array.from(levelGroups.keys());
      const maxLvl = lvls.length ? Math.max(...lvls) : 0;

      // 增加基础半径和最大半径，使节点分布更加分散
      const baseRadius = Math.min(width, height) * 0.35; // 从0.25增加到0.35
      const maxR = Math.min(width, height) * 0.5; // 从0.4增加到0.5

      // 修改半径计算函数，确保即使只有一层也有合理距离
      const getR = (lvl: number) => lvl === 0 ? 0 : baseRadius + (maxR - baseRadius) * (lvl / Math.max(1, maxLvl));

      const result: { id: string; x: number; y: number }[] = [];

      // 放 level = 0 的节点到画布中心
      (levelGroups.get(0) || []).forEach((nd) => {
        result.push({ id: nd.id, x: cx, y: cy });
      });

      // 按节点类型分配不同的角度区间，调整角度分配更加均匀
      const typeAngles: Record<NodeType, { start: number, span: number }> = {
        [NodeType.EVENT]: { start: 0, span: 60 },
        [NodeType.PERSON]: { start: 60, span: 60 },
        [NodeType.ENTITY]: { start: 120, span: 60 },
        [NodeType.GROUP]: { start: 180, span: 60 },
        [NodeType.ASSETS]: { start: 240, span: 60 },
        [NodeType.RELATED_EVENT]: { start: 300, span: 60 },
      };

      // 放其它层级，按类型分区
      for (const [lvl, groupNodes] of levelGroups.entries()) {
        if (lvl === 0) continue;
        const radius = getR(lvl);

        // 按类型分组
        const typeMap = new Map<NodeType, GraphNode[]>();
        groupNodes.forEach((nd) => {
          if (!typeMap.has(nd.type)) typeMap.set(nd.type, []);
          typeMap.get(nd.type)!.push(nd);
        });

        // 为每种类型的节点分配角度
        for (const [nodeType, nodes] of typeMap.entries()) {
          const angleConfig = typeAngles[nodeType] || { start: 0, span: 360 };
          const startAngle = angleConfig.start;
          const spanAngle = angleConfig.span;

          // 在分配的角度范围内均匀分布节点
          nodes.forEach((node, i) => {
            const nodeCount = nodes.length;

            // 增加节点间的间距系数
            const spacing = 1.5; // 增加节点间距

            // 确保节点之间有足够间距
            const angleDeg = startAngle + (spanAngle * (i + 0.5) * spacing) / Math.max(nodeCount, 1);
            const rad = (angleDeg * Math.PI) / 180;

            // 增加随机性范围，使节点分布更加自然
            const jitter = radius * 0.15; // 从0.1增加到0.15
            const jitterX = (Math.random() - 0.5) * jitter;
            const jitterY = (Math.random() - 0.5) * jitter;

            // 如果节点太多，可以适当增加半径
            const nodeCountAdjustment = Math.max(0, nodeCount - 3) * 0.05;
            const adjustedRadius = radius * (1 + nodeCountAdjustment);

            const px = cx + adjustedRadius * Math.cos(rad) + jitterX;
            const py = cy + adjustedRadius * Math.sin(rad) + jitterY;

            result.push({ id: node.id, x: px, y: py });
          });
        }
      }

      return result;
    }

    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    if (width < 50 || height < 50) {
      // fallback 随机布局，防止宽高异常
      const fallback = rNodes.map((nd) => ({
        id: nd.id,
        type: "custom",
        data: nd,
        position: {
          x: Math.random() * 200,
          y: Math.random() * 200,
        },
      }));
      setNodes(fallback);
    } else {
      const posList = computeRadialPositions(rNodes, width, height);
      const rfNodes: Node<GraphNode>[] = rNodes.map((nd) => {
        const found = posList.find((p) => p.id === nd.id);
        // 添加安全检查，如果找不到位置信息，则使用默认位置
        if (!found) {
          return {
            id: nd.id,
            type: "custom",
            data: nd,
            position: {
              x: Math.random() * width,
              y: Math.random() * height,
            },
          };
        }
        return {
          id: nd.id,
          type: "custom",
          data: nd,
          position: { x: found.x, y: found.y },
        };
      });
      setNodes(rfNodes);
    }
  }, [graphData]); // 只依赖 graphData，确保只在 graphData 变化时执行一次

  // ----------------------------------------------------------------------------
  // 2. effect #2：当 nodes 或 graphData.edges 改变时，生成新的 edges 列表
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!graphData) return;

    const rawEdges = graphData.edges;
    // 如果 nodes 还没布局完，就不生成 edges
    if (nodes.length === 0) {
      setEdges([]);
      return;
    }

    // 判断"目标相对于源在哪个象限" → 返回 "top" / "right" / "bottom" / "left"
    function getHandlePosition(
      sx: number,
      sy: number,
      tx: number,
      ty: number,
    ): "top" | "right" | "bottom" | "left" {
      const dx = tx - sx;
      const dy = ty - sy;
      // 使用更精确的角度计算，而不是简单的象限判断
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      // 将角度划分为四个区域
      if (angle > -45 && angle <= 45) return "right";
      if (angle > 45 && angle <= 135) return "bottom";
      if (angle > 135 || angle <= -135) return "left";
      return "top"; // angle > -135 && angle <= -45
    }

    const rfEdges: Edge[] = rawEdges
      .map((e) => {
        // 找到两端的 Node 对象
        const srcNode = nodes.find((n) => n.id === e.source);
        const tgtNode = nodes.find((n) => n.id === e.target);
        if (!srcNode || !tgtNode) {
          // 如果节点不在布局列表里，则忽略这条边
          return null;
        }

        // 确保节点有position属性
        if (!srcNode.position || !tgtNode.position) {
          return null;
        }

        // 从 getNodeDimensions 拿到真实渲染时的宽高
        const { width: sW, height: sH } = getNodeDimensions(
          (srcNode.data as GraphNode).type,
        );
        const { width: tW, height: tH } = getNodeDimensions(
          (tgtNode.data as GraphNode).type,
        );

        // 计算"中心点"：srcNode.position.x/ y 是左上角坐标，加上宽高的一半
        const sx = srcNode.position.x + sW / 2;
        const sy = srcNode.position.y + sH / 2;
        const tx = tgtNode.position.x + tW / 2;
        const ty = tgtNode.position.y + tH / 2;

        // 判断要用哪个方向的 Handle
        const sourceDir = getHandlePosition(sx, sy, tx, ty);
        const targetDir = getHandlePosition(tx, ty, sx, sy);

        const sourceHandleId = `${e.source}-h-${sourceDir}`;
        const targetHandleId = `${e.target}-h-${targetDir}`;

        // 从 properties 中获取 parallelIndex 和 parallelTotal
        const parallelIndex = e.properties?.parallelIndex ?? 0;
        const parallelTotal = e.properties?.parallelTotal ?? 1;

        // 获取源节点类型
        const sourceType = (srcNode.data as GraphNode).type;

        return {
          id: e.id,
          source: e.source,
          sourceHandle: sourceHandleId,
          target: e.target,
          targetHandle: targetHandleId,
          type: "custom",
          data: {
            parallelIndex,
            parallelTotal,
            role: e.relationType, // 使用 relationType 替代 role
            sourceType, // 添加源节点类型
          },
        } as Edge;
      })
      .filter((ed): ed is Edge => ed !== null);

    setEdges(rfEdges);
  }, [nodes, graphData]); // 只在 nodes 或 graphData 改变时触发

  // ----------------------------------------------------------------------------
  // 3. 渲染 ReactFlow，移除节点点击事件
  // ----------------------------------------------------------------------------
  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={true}
        attributionPosition="bottom-left"
        // 移除了节点点击事件
        // 添加控件
        elementsSelectable={false} // 禁用节点选择功能
      >
      </ReactFlow>
    </div>
  );
}

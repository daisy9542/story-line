"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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

export default function GraphContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 修改 rawData 的类型定义，使其与 data-transformer 返回的数据结构匹配
  const [rawData, setRawData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  } | null>(null);

  const [nodes, setNodes] = useState<Node<GraphNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // 2. 修改 fetchData 函数，适配新的数据结构
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/graph");
      if (!res.ok) throw new Error("Network response was not ok");
      return await res.json();
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
      // 可以添加一个备用方案，直接导入本地数据
      // 注意：这需要在客户端代码中导入 JSON 文件，可能需要配置 webpack
      try {
        // 在客户端动态导入数据
        const localData = await import("@/data.json").then(module => module.default);
        // 导入数据转换函数
        const { transformDataToGraph } = await import("@/lib/data-transformer");
        return transformDataToGraph(localData);
      } catch (fallbackError) {
        console.error("Failed to load local data:", fallbackError);
        return null;
      }
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchData();
        setRawData(data);
      } catch (err) {
        console.error("Failed to load graph data", err);
      }
    })();
  }, [fetchData]);

  // ----------------------------------------------------------------------------
  // 3. effect #1：当 rawData 改变时，"先"做 BFS + normalize + 径向布局 → setNodes
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!rawData) return;
    
    const { nodes: rawNodes, edges: rawEdges } = rawData;

    // —— 3.1 BFS 计算每个节点的 "层级 level" —— //
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

    // —— 3.2 normalizeNodes + 附加 level/clusterId/opacity/parallelCount —— //
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

    // —— 3.3 径向布局：把 rNodes 映射到绝对坐标 (x, y) —— //
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
      // nodesArr.forEach((nd) => {
      //   if (!levelGroups.has(nd.level)) levelGroups.set(nd.level, []);
      //   levelGroups.get(nd.level)!.push(nd);
      // });

      const lvls = Array.from(levelGroups.keys());
      const maxLvl = lvls.length ? Math.max(...lvls) : 0;

      // 增加基础半径，确保节点之间有足够距离
      const baseRadius = Math.min(width, height) * 0.25; // 增加基础半径
      const maxR = Math.min(width, height) * 0.4; // 增加最大半径

      // 修改半径计算函数，确保即使只有一层也有合理距离
      const getR = (lvl: number) => lvl === 0 ? 0 : baseRadius + (maxR - baseRadius) * (lvl / Math.max(1, maxLvl));

      const result: { id: string; x: number; y: number }[] = [];

      // 放 level = 0 的节点到画布中心
      (levelGroups.get(0) || []).forEach((nd) => {
        result.push({ id: nd.id, x: cx, y: cy });
      });

      // 按节点类型分配不同的角度区间
      const typeAngles: Record<NodeType, { start: number, span: number }> = {
        [NodeType.EVENT]: { start: 0, span: 90 },
        [NodeType.PERSON]: { start: 90, span: 90 },
        [NodeType.GROUP]: { start: 180, span: 90 },
        [NodeType.ASSETS]: { start: 270, span: 45 },
        [NodeType.RELATED_EVENT]: { start: 315, span: 45 },
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
            // 确保节点之间有足够间距
            const angleDeg = startAngle + (spanAngle * (i + 0.5)) / Math.max(nodeCount, 1);
            const rad = (angleDeg * Math.PI) / 180;

            // 添加一些随机性，避免完全对齐
            const jitter = radius * 0.1; // 10% 的半径作为抖动范围
            const jitterX = (Math.random() - 0.5) * jitter;
            const jitterY = (Math.random() - 0.5) * jitter;

            const px = cx + radius * Math.cos(rad) + jitterX;
            const py = cy + radius * Math.sin(rad) + jitterY;

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
        const found = posList.find((p) => p.id === nd.id)!;
        return {
          id: nd.id,
          type: "custom",
          data: nd,
          position: { x: found.x, y: found.y },
        };
      });
      setNodes(rfNodes);
    }
  }, [rawData]); // 只依赖 rawData，确保只在 rawData 变化时执行一次

  // ----------------------------------------------------------------------------
  // 4. effect #2：当 nodes 或 rawData.edges 改变时，生成新的 edges 列表
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!rawData) return;

    const rawEdges = rawData.edges;
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
      if (Math.abs(dx) >= Math.abs(dy)) {
        return dx > 0 ? "right" : "left";
      }
      return dy > 0 ? "bottom" : "top";
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
          },
        } as Edge;
      })
      .filter((ed): ed is Edge => ed !== null);

    setEdges(rfEdges);
  }, [nodes, rawData]); // 只在 nodes 或 rawData 改变时触发

  // ----------------------------------------------------------------------------
  // 5. 渲染 ReactFlow，移除节点点击事件
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

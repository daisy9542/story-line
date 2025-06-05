"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { GraphNode, NodeType } from "@/types";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from "react-flow-renderer";

import { normalizeNodes } from "@/lib/graph-normalize";
import { getNodeDimensions } from "@/lib/node-dimensions";

import CustomEdge from "./custom-edge";
import NodeRenderer from "./node-renderer";

const nodeTypes = { custom: NodeRenderer };
const edgeTypes = { custom: CustomEdge };

export default function GraphContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. state: rawData, nodes, edges
  const [rawData, setRawData] = useState<{
    nodes: Array<GraphNode>;
    edges: Array<{
      source: string;
      target: string;
      parallelIndex: number;
      parallelTotal: number;
      role?: string;
    }>;
  } | null>(null);

  const [nodes, setNodes] = useState<Node<GraphNode>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // 2. fetchData：只在 mount 时跑一次，填充 rawData
  const fetchData = useCallback(async () => {
    const res = await fetch("/api/graph");
    if (!res.ok) throw new Error("Network response was not ok");
    return (await res.json()) as {
      nodes: Array<{
        id: string;
        type: NodeType;
        label: string;
        img?: string;
        time?: string;
        tags?: string[];
        orgId?: string;
        parentEventId?: string;
        changePercent?: string;
        memberCount?: number;
      }>;
      edges: Array<{
        source: string;
        target: string;
        parallelIndex: number;
        parallelTotal: number;
        role?: string;
      }>;
    };
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
  // 3. effect #1：当 rawData 改变时，“先”做 BFS + normalize + 径向布局 → setNodes
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (!rawData) return;

    const { nodes: rawNodes, edges: rawEdges } = rawData;

    // —— 3.1 BFS 计算每个节点的 “层级 level” —— //
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
      const center = rawNodes.find((n) => n.type === NodeType.EVENT);
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
    let rNodes: GraphNode[] = normalizeNodes(rawNodes);
    rNodes = rNodes.map((n) => {
      const lvl = levelMap.get(n.id) ?? -1;
      let cId: string;
      if (n.type === NodeType.GROUP) cId = n.id;
      else if (n.type === NodeType.PERSON)
        cId = (n as any).orgId ?? "uncat-person";
      else if (n.type === NodeType.ASSETS) cId = "assets";
      else if (n.type === NodeType.EVENT && lvl > 0)
        cId = (n as any).parentEventId ?? "uncat-event";
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
    // 如果你不想展示“与中心不连通”的节点，可以 filter 掉 level<0
    rNodes = rNodes.filter((n) => n.level >= 0);

    // —— 3.3 径向布局：把 rNodes 映射到绝对坐标 (x, y) —— //
    function computeRadialPositions(
      nodesArr: GraphNode[],
      width: number,
      height: number,
    ): { id: string; x: number; y: number }[] {
      const cx = width / 2;
      const cy = height / 2;

      const levelGroups = new Map<number, GraphNode[]>();
      nodesArr.forEach((nd) => {
        if (!levelGroups.has(nd.level)) levelGroups.set(nd.level, []);
        levelGroups.get(nd.level)!.push(nd);
      });

      const lvls = Array.from(levelGroups.keys());
      const maxLvl = lvls.length ? Math.max(...lvls) : 0;
      const maxR = Math.min(width, height) / 2 - 40;
      const getR = (lvl: number) => (maxLvl <= 1 ? 0 : (maxR / maxLvl) * lvl);

      const result: { id: string; x: number; y: number }[] = [];

      // 放 level = 0 的节点到画布中心
      (levelGroups.get(0) || []).forEach((nd) => {
        result.push({ id: nd.id, x: cx, y: cy });
      });

      // 放其它层级
      for (const [lvl, groupNodes] of levelGroups.entries()) {
        if (lvl === 0) continue;
        const radius = getR(lvl);

        // 先按 clusterId 分簇
        const clusterMap = new Map<string, GraphNode[]>();
        groupNodes.forEach((nd) => {
          const cid = nd.clusterId;
          if (!clusterMap.has(cid)) clusterMap.set(cid, []);
          clusterMap.get(cid)!.push(nd);
        });

        const clusters = Array.from(clusterMap.values());
        const cCount = clusters.length;
        let angleAcc = 0;

        clusters.forEach((clusterNodes) => {
          const sectorAngle = 360 / cCount;
          const startA = angleAcc;
          const span = sectorAngle;

          clusterNodes.forEach((nodeInCluster, i) => {
            const m = clusterNodes.length;
            const angleDeg = startA + ((i + 1) / (m + 1)) * span;
            const rad = (angleDeg * Math.PI) / 180;
            const px = cx + radius * Math.cos(rad);
            const py = cy + radius * Math.sin(rad);
            result.push({ id: nodeInCluster.id, x: px, y: py });
          });

          angleAcc += sectorAngle;
        });
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

    // 判断“目标相对于源在哪个象限” → 返回 "top" / "right" / "bottom" / "left"
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

        // 计算“中心点”：srcNode.position.x/ y 是左上角坐标，加上宽高的一半
        const sx = srcNode.position.x + sW / 2;
        const sy = srcNode.position.y + sH / 2;
        const tx = tgtNode.position.x + tW / 2;
        const ty = tgtNode.position.y + tH / 2;

        // 判断要用哪个方向的 Handle
        const sourceDir = getHandlePosition(sx, sy, tx, ty);
        const targetDir = getHandlePosition(tx, ty, sx, sy);

        const sourceHandleId = `${e.source}-h-${sourceDir}`;
        const targetHandleId = `${e.target}-h-${targetDir}`;

        return {
          id: `${e.source}-${e.target}-${e.parallelIndex}`,
          source: e.source,
          sourceHandle: sourceHandleId,
          target: e.target,
          targetHandle: targetHandleId,
          type: "custom",
          data: {
            parallelIndex: e.parallelIndex,
            parallelTotal: e.parallelTotal,
            role: e.role,
          },
        } as Edge;
      })
      .filter((ed): ed is Edge => ed !== null);

    setEdges(rfEdges);
  }, [nodes, rawData]); // 只在 nodes 或 rawData.edges 改变时触发

  // ----------------------------------------------------------------------------
  // 5. 渲染 ReactFlow，传入 nodes / edges / 自定义 nodeTypes / edgeTypes
  // ----------------------------------------------------------------------------
  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView={false}
        attributionPosition="bottom-left"
      >
      </ReactFlow>
    </div>
  );
}

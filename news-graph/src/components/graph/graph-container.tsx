"use client";

import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
} from "react-flow-renderer";

import { RenderNodeData } from "@/types";
// import { normalizeEdges } from "@/lib/graph-edge-normalize";
import { normalizeNodes } from "@/lib/graph-normalize";

import CustomEdge from "./custom-edge";
import NodeRenderer from "./node-renderer";

const nodeTypes = { custom: NodeRenderer };
const edgeTypes = { custom: CustomEdge };

export default function GraphContainer() {
  const [nodes, setNodes] = useState<Node<RenderNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // fetchData can stay as-is
  const fetchData = useCallback(async () => {
    const res = await fetch("/api/graph");
    if (!res.ok) throw new Error("Network response was not ok");
    return (await res.json()) as { nodes: any[]; edges: any[] };
  }, []);

  useEffect(() => {
    // immediately-invoked async function so we can await
    (async () => {
      try {
        const rawData = await fetchData();
        console.log("Raw data:", rawData);
        const rNodes = normalizeNodes(rawData.nodes);
        // const rEdges = normalizeEdges(rawData.edges);
        const rEdges = rawData.edges;

        // 初步布局占位
        setNodes(
          rNodes.map((n) => ({
            id: n.id,
            type: "custom",
            data: n,
            position: { x: Math.random() * 400, y: Math.random() * 400 },
          })),
        );
        setEdges(
          rEdges.map((e) => ({
            id: `${e.source}-${e.target}-${e.parallelIndex}`,
            source: e.source,
            target: e.target,
            type: "custom",
            data: {
              parallelIndex: e.parallelIndex,
              parallelTotal: e.parallelTotal,
            },
          })),
        );
      } catch (err) {
        console.error("Failed to load graph data", err);
      }
    })();
  }, [fetchData]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      attributionPosition="bottom-left"
    >
    </ReactFlow>
  );
}

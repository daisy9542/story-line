"use client";

import { useEffect, useState } from "react";
import { parse } from "papaparse";

import type { GraphData, Link, Node } from "@/types/graph";
import ForceGraph from "@/components/graph/force-graph";

const GraphView = () => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    fetch("/sample.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const result = parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const rows = result.data as any[];

        const nodesMap = new Map<string, Node>();
        const links: Link[] = [];

        rows.forEach((row) => {
          const sourceId = row.author_id;
          const sourceName = row.username;
          const sourceFollowers = parseInt(row.followers || "0");

          const targetId = row.label;
          const targetFollowers = parseInt(row.label_followers || "0");

          if (!nodesMap.has(sourceId)) {
            nodesMap.set(sourceId, {
              id: sourceId,
              name: sourceName,
              followers: sourceFollowers,
            });
          }

          if (row.object_type === "user" && !nodesMap.has(targetId)) {
            nodesMap.set(targetId, {
              id: targetId,
              name: targetId,
              followers: targetFollowers,
            });
          }

          links.push({
            source: sourceId,
            target: targetId,
            score: parseFloat(row.score_current_time || "0"),
          });
        });

        setGraphData({
          nodes: Array.from(nodesMap.values()),
          links,
        });
      });
  }, []);

  return (
    <div className="relative flex h-full w-full">
      {graphData && (
        <ForceGraph nodes={graphData.nodes} links={graphData.links} />
      )}
    </div>
  );
};

export default GraphView;

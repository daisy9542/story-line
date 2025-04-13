// src/utils/csvParser.ts

import Papa from "papaparse";
import { Node, Link, GraphData } from "@/types/graph";

interface RawCsvRow {
  author_id: string;
  username: string;
  followers: string;
  label: string;
  label_followers: string;
  score_current_time: string;
  object_type: string;
}

export const parseCSV = (file: File): Promise<GraphData> => {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rawRows = result.data;
        const nodesMap = new Map<string, Node>();
        const links: Link[] = [];

        rawRows.forEach((row) => {
          const sourceId = row.author_id;
          const sourceName = row.username;
          const sourceFollowers = parseInt(row.followers || "0");

          const targetId = row.label;
          const targetFollowers = parseInt(row.label_followers || "0");

          // 创建 source 节点
          if (!nodesMap.has(sourceId)) {
            nodesMap.set(sourceId, {
              id: sourceId,
              name: sourceName,
              followers: sourceFollowers,
            });
          }

          // 创建 target 节点（仅限 user 类型）
          if (row.object_type === "user" && !nodesMap.has(targetId)) {
            nodesMap.set(targetId, {
              id: targetId,
              name: targetId,
              followers: targetFollowers,
            });
          }

          // 创建边
          links.push({
            source: sourceId,
            target: targetId,
            score: parseFloat(row.score_current_time || "0"),
          });
        });

        resolve({
          nodes: Array.from(nodesMap.values()),
          links,
        });
      },
      error: (err) => reject(err),
    });
  });
};

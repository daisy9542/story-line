// src/types/graph.ts

import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface Node extends SimulationNodeDatum {
  id: string;
  name: string;
  followers: number;
  degree?: number;
}

export interface Link extends SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  score: number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

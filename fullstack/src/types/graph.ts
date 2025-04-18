import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export interface ForceNode extends SimulationNodeDatum {
  id: string;
  name: string;
  followers: number;
  degree?: number;
  fx?: number;
  fy?: number;
}

export interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: string | ForceNode;
  target: string | ForceNode;
  score: number;
}

export interface GraphData {
  nodes: ForceNode[];
  links: ForceLink[];
}

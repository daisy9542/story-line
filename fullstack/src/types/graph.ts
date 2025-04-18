export interface ForceNode {
  id: string;
  name: string;
  followers: number;
  degree?: number;
}

export interface ForceLink {
  source: string | ForceNode;
  target: string | ForceNode;
  score: number;
}

export interface GraphData {
  nodes: ForceNode[];
  links: ForceLink[];
}

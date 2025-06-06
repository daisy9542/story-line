export enum NodeType {
  EVENT = "event",
  PERSON = "person",
  GROUP = "group",
  ASSETS = "assets",
  RELATED_EVENT = "related_event",
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  level?: number;
  clusterId?: string;
  opacity?: number;
  parallelCount?: number;
  img?: string;
  time?: string;
  tags?: string[];
  url?: string;
  sentiment?: number;
}

export interface EventNode extends GraphNode {
  type: NodeType.EVENT;
  background?: string;
  viralPotential?: string;
}

export interface RelatedEventNode extends GraphNode {
  type: NodeType.RELATED_EVENT;
  sentiment: number;
  date: string;
  url: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationType: string;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

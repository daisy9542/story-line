export enum NodeType {
  EVENT = "Event",
  GROUP = "Group",
  PERSON = "Person",
  ASSETS = "Assets",
}

export interface BaseNode {
  id: string;
  type: NodeType;
  label: string; // 事件挑剔，人物/公司/资产的名称，都映射到 label
  img?: string; // 单图模式
  level: number; // 距离中心事件的层级，用来计算 size/opacity
}

// 事件节点，带 tags、time、多图
export interface EventNode extends BaseNode {
  type: NodeType.EVENT;
  tags: string[];
  time: number; // 时间戳
  imgs: string[]; // 多图
}

export interface PersonNode extends BaseNode {
  type: NodeType.PERSON;
}

export interface OrgNode extends BaseNode {
  type: NodeType.GROUP;
}

export interface ASSETSNode extends BaseNode {
  type: NodeType.ASSETS;
  changePercent: number;
}

export type NodeData = EventNode | PersonNode | OrgNode | ASSETSNode;

// 渲染时附加的计算属性（在 normalize 阶段填入）
export type RenderNodeData = NodeData & {
  size: number;
  opacity: number;
  showLabel: boolean;
};

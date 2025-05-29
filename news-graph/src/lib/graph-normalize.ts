import { NodeData, NodeType, RenderNodeData } from "@/types";

// 为每种类型设置一个“基础尺寸”：
const BASE_SIZE: Record<NodeType, number> = {
  [NodeType.EVENT]: 240,
  [NodeType.Organization]: 140,
  [NodeType.Person]: 100,
  [NodeType.Asset]: 100,
};

// 根据层级计算 size / opacity / showLabel：
function computeSize(type: NodeType, level: number): number {
  const base = BASE_SIZE[type];
  // 中心事件 level = 0，size = base；每增一层，尺寸缩为原来的 1/level
  return base / Math.max(1, level * 1.2);
}

function computeOpacity(level: number): number {
  // level 0 完全不透明，level 1 为 0.85，依次递减，最低保底 0.3
  return Math.max(0.3, 1 - level * 0.15);
}

function computeShowLabel(level: number): boolean {
  // 文字只在前两层展示，第三层及以后只渲染图片
  return level <= 1;
}

/**
 * normalizeNodes
 *  - 输入：原始节点数组，已带 level 信息
 *  - 输出：附带 size / opacity / showLabel
 */
export function normalizeNodes(nodes: NodeData[]): RenderNodeData[] {
  return nodes.map((node) => ({
    ...node,
    size: computeSize(node.type, node.level),
    opacity: computeOpacity(node.level),
    showLabel: computeShowLabel(node.level),
  }));
}

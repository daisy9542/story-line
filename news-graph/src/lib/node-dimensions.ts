/**
 * 返回给定节点类型在画布上最终渲染时的宽度和高度（单位：像素）。
 * 注意：这个映射必须和 NodeRenderer.tsx 里给节点 container 填的宽高保持一致！
 */
import { NodeType } from "@/types";

export function getNodeDimensions(type: NodeType): {
  width: number;
  height: number;
} {
  switch (type) {
    case NodeType.EVENT:
      return { width: 200, height: 200 };
    case NodeType.PERSON:
      return { width: 180, height: 30 };
    case NodeType.GROUP:
      return { width: 120, height: 80 };
    case NodeType.ASSETS:
      return { width: 280, height: 30 };
    default:
      return { width: 120, height: 40 };
  }
}

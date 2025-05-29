import React from "react";
import {
  getBezierPath,
  Position,
  EdgeProps as RFEdgeProps,
} from "react-flow-renderer";

interface Props extends RFEdgeProps {
  data: {
    parallelIndex: number;
    parallelTotal: number;
  };
}

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style,
}: Props) => {
  const { parallelIndex: idx, parallelTotal: tot } = data;
  // 计算 offset，正负交替
  const offset = (idx - (tot - 1) / 2) * 15;
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Right,
    targetX,
    targetY,
    targetPosition: Position.Left,
    curvature: 0.4,
    // 可以在这里加入 offset 到控制点
  });

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={path} />
    </>
  );
};

export default CustomEdge;

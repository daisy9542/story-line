import React from "react";
import { EdgeProps, getBezierPath, getEdgeCenter } from "react-flow-renderer";

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: EdgeProps & {
  data: {
    parallelIndex: number;
    parallelTotal: number;
    role?: string; // 例如 "Chief Scientist"
  };
}) {
  // 1. 先用 React Flow 的 getBezierPath 计算一条“非常平滑”的二次贝塞尔
  //    由于我们已经把 Handle 定在最邻近的“上/右/下/左”中点，
  //    getBezierPath 大多数情况下已经可以生成一条很接近直线的曲线。
  //    如果你觉得仍然“过于曲折”，后面我们可以把控制点拉得更“接近” source→target 连线中点。
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    // 可以传一个强制的“偏移距离”让曲线更直，例如 curve=0.5；默认是 0.5
    // 但你可以尝试大一些或小一些，比如 curve: 0.3，能让拐弯更陡峭，更贴近直线。
    curvature: 0.3,
  });

  // 2. 通过 getEdgeCenter 拿到曲线中间点，用来放置一个带 label 的 <foreignObject>
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })!;

  return (
    <>
      {/* 3. 渲染这条曲线路径，需要一个明显的 stroke */}
      <path
        id={id}
        d={edgePath}
        stroke="#555" /* 在深色背景上用稍亮的灰 (#555) 才能看得清 */
        strokeWidth={1.2} /* 线条粗细可以根据喜好做小幅度调整 */
        fill="none"
        style={style}
      />

      {/* 4. 如果 data.role 存在，就在曲线中点插入一个小标签 */}
      {data.role && (
        <foreignObject
          x={edgeCenterX - 40}
          y={edgeCenterY - 8}
          width={80}
          height={16}
          style={{ overflow: "visible" }}
        >
          <div className="bg-opacity-60 pointer-events-none flex items-center justify-center rounded bg-gray-700 px-1 text-xs text-white">
            {data.role}
          </div>
        </foreignObject>
      )}
    </>
  );
}

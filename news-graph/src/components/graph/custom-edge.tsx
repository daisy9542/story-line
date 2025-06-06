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
  // 计算贝塞尔曲线路径
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.3,
  });

  // 获取边的中心点
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })!;

  // 为边创建唯一的渐变ID
  const gradientId = `edge-gradient-${id}`;

  return (
    <>
      {/* 定义渐变 */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4423FE" />
          <stop offset="50%" stopColor="#5B3EFF" />
          <stop offset="100%" stopColor="#A190FF" />
        </linearGradient>
      </defs>

      {/* 渲染带渐变的路径 */}
      <path
        id={id}
        d={edgePath}
        stroke="rgba(91, 62, 255, 1)"
        strokeWidth={1}
        fill="none"
        style={style}
      />

      {/* 修改关系标签样式 */}
      {data.role && (
        <foreignObject
          x={edgeCenterX - 50} // 减小初始宽度
          y={edgeCenterY - 12} // 调整垂直位置
          width={100} // 减小初始宽度
          height={24} // 减小高度
          style={{ overflow: "visible" }}
          className="edge-label-container"
        >
          <div
            style={{
              display: "inline-flex", // 改为 inline-flex
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1E1E23", // 添加不透明的背景色
              color: "rgba(200, 200, 210, 0.6)", // 浅灰色文字
              padding: "2px 8px", // 水平方向增加内边距，垂直方向减少
              borderRadius: "4px", // 保持圆角
              fontSize: "12px",
              fontWeight: "300",
              border: "1px solid rgba(255, 255, 255, 0.1)", // 细边框
              pointerEvents: "none", // 防止鼠标事件干扰
              whiteSpace: "nowrap", // 防止文字换行
              width: "fit-content", // 宽度适应内容
              height: "fit-content", // 高度适应内容
              margin: "0 auto", // 水平居中
            }}
          >
            {data.role}
          </div>
        </foreignObject>
      )}
    </>
  );
}

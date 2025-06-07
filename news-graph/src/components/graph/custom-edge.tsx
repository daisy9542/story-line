import React from "react";
import { EdgeProps, getBezierPath, getEdgeCenter } from "react-flow-renderer";

// 将组件定义为React.FC<EdgeProps<any>>类型，并处理可选的data属性
const CustomEdge: React.FC<EdgeProps<any>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  source,
  target,
}) => {
  // 提取data中的属性，处理data可能为undefined的情况
  const parallelIndex = data?.parallelIndex ?? 0;
  const parallelTotal = data?.parallelTotal ?? 1;
  const role = data?.role;
  const sourceType = data?.sourceType;

  // 为边创建唯一的箭头标记ID
  const arrowId = `arrow-${id}`;

  // 计算贝塞尔曲线路径，使用非常小的曲率使线条几乎是直的
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.05, // 使用非常小的曲率
  });

  // 获取边的中心点，添加安全检查
  const edgeCenter = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // 默认值，防止edgeCenter为null
  const edgeCenterX = edgeCenter ? edgeCenter[0] : (sourceX + targetX) / 2;
  const edgeCenterY = edgeCenter ? edgeCenter[1] : (sourceY + targetY) / 2;

  // 为边创建唯一的渐变ID
  const gradientId = `edge-gradient-${id}`;

  return (
    <>
      {/* 定义渐变和箭头标记 */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4423FE" />
          <stop offset="50%" stopColor="#5B3EFF" />
          <stop offset="100%" stopColor="#A190FF" />
        </linearGradient>

        {/* 定义箭头标记 */}
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(91, 62, 255, 1)" />
        </marker>
      </defs>

      {/* 渲染带渐变和箭头的路径 */}
      <path
        id={id}
        d={edgePath}
        stroke="rgba(91, 62, 255, 1)"
        strokeWidth={1}
        fill="none"
        style={style}
        markerEnd={`url(#${arrowId})`}
      />

      {/* 修改关系标签样式 */}
      {role && (
        <foreignObject
          x={edgeCenterX - 50} // 减小初始宽度
          y={edgeCenterY - 12} // 调整垂直位置
          width={100} // 减小初始宽度
          height={24} // 减小高度
          style={{ overflow: "visible", display: "flex", justifyContent: "center", alignItems: "center"}}
          className="edge-label-container"
        >
          <div
            style={{
              display: "inline-flex", // 改为 inline-flex
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000000", // 添加不透明的背景色
              color: "rgba(200, 200, 210, 0.6)", // 浅灰色文字
              padding: "1px 4px 2px 4px", // 水平方向增加内边距，垂直方向减少
              borderRadius: "4px", // 保持圆角
              fontSize: "10px",
              fontWeight: "300",
              lineHeight: "14px",
              border: "1px solid rgba(255, 255, 255, 0.1)", // 细边框
              pointerEvents: "none", // 防止鼠标事件干扰
              whiteSpace: "nowrap", // 防止文字换行
              width: "fit-content", // 宽度适应内容
              height: "fit-content", // 高度适应内容
              margin: "0 auto", // 水平居中
            }}
          >
            {role}
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge;

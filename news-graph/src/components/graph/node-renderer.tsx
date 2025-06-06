import React, { useRef } from "react";
import { GraphNode, NodeType } from "@/types";
import { BadgeDollarSign, Building2, User, Users } from "lucide-react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

import { getNodeDimensions } from "@/lib/node-dimensions";
import { toRelativeShort } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NodeRenderer = ({ id, data }: NodeProps<GraphNode>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMainEvent = id === "main-event";

  // 因为改成“不使用 size”，这里用 CSS class 或者内联样式给节点固定一个宽高
  // 比如："新闻事件" 200×100，其他节点 120×40。你可以根据 data.type 做区分。
  const { width, height } = getNodeDimensions(data.type);

  // =========== 1. 强制在 四个 边缘中点 放置一个“无 id”的 Handle，用作 edge 默认的目标 or 源 =============
  //    - 因为我们会在 GraphContainer 中动态决定每条边到底挂上下左右哪一个，
  //      所以这里先渲染出四个"候选 Handle"，分别用 id: `${id}-h-top/right/bottom/left`
  //    - "type" 取决于你想让它当 source 还是 target；这里先不指定 type=id/id，
  //      我们把"上下左右"都渲染成既可 "source" 又可 "target" 的版本。
  //    在 React Flow 中，Handle 组件可以同时声明为 source 或 target，所以下面每个都写两次：
  //      <Handle type="target" position={Position.XXX} id={`${id}-h-xxx`} />
  //      <Handle type="source" position={Position.XXX} id={`${id}-h-xxx`} />
  //
  //  实际上，如果一条边只需要 "sourceHandle" 或 "targetHandle" 其中之一自动匹配，
  //  也可以只渲染一个 type，另一侧让 React Flow 自动默认。但为了灵活起见，这里四个都做成“无差别可用”：
  const candidateHandles = (
    <>
      {/* 上边缘中点 */}
      <Handle
        type="source"
        position={Position.Top}
        id={`${id}-h-top`}
        style={{
          left: "50%",
          top: 0,
          transform: "translate(-50%, -50%)",
          background: "transparent", // 改为透明
          width: 8,
          height: 8,
          opacity: 0, // 添加完全透明
          border: "none", // 移除边框
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-h-top`}
        style={{
          left: "50%",
          top: 0,
          transform: "translate(-50%, -50%)",
          background: "transparent", // 改为透明
          width: 8,
          height: 8,
          opacity: 0, // 添加完全透明
          border: "none", // 移除边框
        }}
      />

      {/* 右边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-h-right`}
        style={{
          left: "100%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id={`${id}-h-right`}
        style={{
          left: "100%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />

      {/* 下边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${id}-h-bottom`}
        style={{
          left: "50%",
          top: "100%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id={`${id}-h-bottom`}
        style={{
          left: "50%",
          top: "100%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />

      {/* 左边缘中点 - 同样修改 */}
      <Handle
        type="source"
        position={Position.Left}
        id={`${id}-h-left`}
        style={{
          left: 0,
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-h-left`}
        style={{
          left: 0,
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "transparent",
          width: 8,
          height: 8,
          opacity: 0,
          border: "none",
        }}
      />
    </>
  );

  // =========== 2. 渲染节点主体的 CSS 样式（pos:relative + 固定宽高） ===========
  const containerStyle: React.CSSProperties = {
    maxWidth: `${width}px`,
    maxHeight: `${height}px`,
    position: "relative", // 使得上面所有百分比定位的 Handle 都能基于此容器
    backgroundColor: "#17181A",
    borderRadius: "8px",
    padding: "6px 8px",
    fontSize: "12px",
    fontWeight: 300,
    overflow: "visible", // 允许 Handle 挂在边缘之外
    opacity: data.opacity,
    lineHeight: "16px",
    letterSpacing: 0,
  };
  
  let typeWidthStyle: React.CSSProperties = {};
  let innerContent: React.ReactNode = null;
  switch (data.type) {
    case NodeType.PERSON:
      typeWidthStyle = {
        width: "auto",
        height: "30px",
        padding: "10px",
        borderRadius: "10px",
      };
      innerContent = (
        <div className="flex h-full items-center">
          <span className="text-red">{data.label}</span>
        </div>
      );
      break;

    case NodeType.GROUP:
      typeWidthStyle = {
        borderRadius: "10px",
        padding: "10px",
      };
      innerContent = (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          {data.img ? (
            <img
              src={data.img}
              alt={data.label}
              className="h-6 w-6 object-contain"
            />
          ) : (
            <div className="flex items-center justify-center">
              <Users className="h-6 w-6 rounded-full bg-white text-blue-400" />
            </div>
          )}
          <span className="truncate text-center">{data.label}</span>
        </div>
      );
      break;

    case NodeType.EVENT:
      if (isMainEvent) {
        // 主事件节点使用嵌套 div 实现渐变边框
        typeWidthStyle = {
          padding: "0", // 移除内边距
          background: "transparent", // 背景透明
          borderRadius: "12px",
          width: "200px",
        };

        innerContent = (
          <div
            style={{
              position: "relative",
              padding: "1.5px", // 为渐变边框留出空间
              borderRadius: "12px",
              background: "linear-gradient(84.79deg, #4423FE -28.13%, #5B3EFF 46.23%, #A190FF 127.01%)",
              width: "100%",
              height: "100%",
            }}
          >
            <div
              style={{
                background: "#17181A", // 使用与外层容器相同的背景色
                borderRadius: "10.5px", // 略小于外层，确保边框可见
                padding: "12px",
                width: "100%",
                height: "100%",
              }}
            >
              <div className="flex flex-col gap-2">
                <span>{data.label}</span>
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((_, idx) => (
                      <Building2
                        key={idx}
                        className="h-4 w-4 rounded-full bg-white text-blue-400"
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {toRelativeShort(data.time!)}
                  </div>
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <div
                        key={tag}
                        className="rounded-md bg-[rgb(34,39,55)] p-[5px] text-[10px] text-[RGB(68,104,205)]"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        // 非主事件节点
        typeWidthStyle = {
          borderRadius: "12px",
          padding: "12px",
          width: "200px",
        };

        innerContent = (
          <div className="flex flex-col gap-2">
            <span>{data.label}</span>
            <div className="flex justify-between">
              <div className="flex space-x-1">
                {[1, 2, 3].map((_, idx) => (
                  <Building2
                    key={idx}
                    className="h-4 w-4 rounded-full bg-white text-blue-400"
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {toRelativeShort(data.time!)}
              </div>
            </div>
            {/* {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-md bg-[rgb(34,39,55)] p-[5px] text-[10px] text-[RGB(68,104,205)]"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        );
      }
      break;

    case NodeType.ASSETS:
      typeWidthStyle = {
        width: "auto",
        height: "30px",
        padding: "6px",
        paddingRight: "12px",
        borderRadius: "100px",
      };
      innerContent = (
        <div className="flex h-full items-center gap-1.5">
          {data.img ? (
            <img
              src={data.img}
              alt={data.label}
              className="rounded-full object-cover"
            />
          ) : (
            <BadgeDollarSign className="h-6 w-6 rounded-full bg-white text-blue-400" />
          )}
          <span className="text-[14px]">{data.label}</span>
          {/* <span
            className={`text-sm ${data.changePercent < 0 ? "text-[#FF3838]" : "text-[#0FE871]"}`}
          >
            {data.changePercent >= 0 ? "+" : ""}
            {data.changePercent}%
          </span> */}
        </div>
      );
      break;

    default:
      // ------------- 兜底 -------------
      typeWidthStyle = {
        // borderRadius: 4,
      };
      innerContent = (
        // <div className="flex h-full w-full items-center justify-center">
        // <span className="text-xs text-white">{data.label}</span>
        // </div>
        <div></div>
      );
  }

  return (
    <div style={{ ...containerStyle, ...typeWidthStyle }}>
      {innerContent}
      {candidateHandles}

      {/* Popover 逻辑（同你原来一样，鼠标 hover 弹出详细卡片） */}
      {/* <Popover>
        <PopoverTrigger asChild>
          <div className="absolute inset-0" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="center"
          className="z-50 max-w-xs rounded bg-white p-3 shadow-lg"
        >
          <h4 className="mb-1 text-sm font-semibold">{data.label}</h4>
          {data.type === NodeType.PERSON && (
            <div className="text-xs text-gray-600">
              人物：{data.label} 的详细信息…
            </div>
          )}
          {data.type === NodeType.GROUP && (
            <div className="text-xs text-gray-600">
              组织：{data.label}。成员数：{data.memberCount ?? "未知"}。
            </div>
          )}
          {data.type === NodeType.EVENT && (
            <div className="space-y-1 text-xs text-gray-600">
              <p>时间：{data.time}</p>
              <div className="flex flex-wrap gap-1">
                {(data.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-blue-100 px-1 py-0.5 text-[9px] text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {data.type === NodeType.ASSETS && (
            <div className="text-xs text-gray-600">
              资产：{data.label}。涨跌：{data.changePercent}.
            </div>
          )}
        </PopoverContent>
      </Popover> */}
    </div>
  );
};

export default NodeRenderer;

import React, { useRef } from "react";
import { NodeType, RenderNodeData } from "@/types";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import {
  BadgeDollarSign,
  Building2,
  Calendar,
  Group,
  Tag,
  User,
  Users,
} from "lucide-react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

import { toRelativeShort } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NodeRenderer = ({ id, data }: NodeProps<RenderNodeData>) => {
  const ref = useRef<HTMLDivElement>(null);

  // 根据并行边数量渲染右侧 Handle
  const handleCount = data.parallelCount || 1;
  const handles = Array.from({ length: handleCount }).map((_, idx) => {
    const top = ((idx + 1) / (handleCount + 1)) * 100;
    return (
      <Handle
        key={idx}
        type="source"
        position={Position.Right}
        id={`${id}-s-${idx}`}
        style={{ top: `${top}%`, background: "#888" }}
      />
    );
  });

  /**
   * 以下变量控制节点最外层容器的尺寸和透明度
   * - data.size: 归一化后得出的“基准高度”
   * - data.opacity: 归一化后得出的透明度
   */
  const commonContainerStyle: React.CSSProperties = {
    // height: data.size,
    opacity: data.opacity,
    backgroundColor: "#17181A",
    fontWeight: 300,
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: 0,
    color: "white",
  };

  /**
   * 按照不同节点类型返回对应的“内层内容”和“宽度策略”。
   * 最外层容器统一套用 `commonContainerStyle`，然后用 `typeWidthStyle` 覆盖宽度或其他样式。
   */
  let typeWidthStyle: React.CSSProperties = {};
  let innerContent: React.ReactNode = null;

  switch (data.type) {
    case NodeType.PERSON:
      typeWidthStyle = {
        width: "auto",
        height: "30px",
        padding: "5px",
        paddingRight: "12px",
        borderRadius: "100px",
      };
      innerContent = (
        <div className="flex h-full items-center gap-1.5 pl-[5px]">
          {data.img ? (
            <img
              src={data.img}
              alt={data.label}
              className="h-5 w-5 rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 rounded-full bg-white text-blue-400" />
          )}
          <span>{data.label}</span>
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
          <span className="truncate text-center text-white">{data.label}</span>
        </div>
      );
      break;

    case NodeType.EVENT:
      typeWidthStyle = {
        borderRadius: "12px",
        padding: "12px",
        width: "200px",
      };
      innerContent = (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex space-x-1">
              {/* {data.imgs &&
                data.imgs.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`source-${idx}`}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ))} */}
              {[1, 2, 3].map((_, idx) => (
                <Building2
                  key={idx}
                  className="h-4 w-4 rounded-full bg-white text-blue-400"
                />
              ))}
            </div>
            <div className="text-xs text-gray-500">
              {toRelativeShort(data.time)}
            </div>
          </div>
          <span>{data.label}</span>
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
      );
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
          <span
            className={`text-sm ${data.changePercent < 0 ? "text-[#FF3838]" : "text-[#0FE871]"} `}
          >
            {data.changePercent >= 0 ? "+" : ""}
            {data.changePercent}%
          </span>
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
    <div
      ref={ref}
      style={{
        ...commonContainerStyle,
        ...typeWidthStyle,
      }}
    >
      {/* 渲染对应类型的内部内容 */}
      {innerContent}

      {/* 渲染右侧的 Handles */}
      {handles}

      {/* Popover：鼠标悬浮时显示详细卡片 */}
      <Popover>
        <PopoverTrigger asChild>
          {/* 用一个绝对的 div 全覆盖节点，保证整个区域都能触发 Popover */}
          <div className="absolute inset-0" />
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="center"
          className="z-50 max-w-xs rounded bg-white p-3 shadow-lg"
        >
          {/* 弹窗内部根据类型展示更详细信息 */}
          <h4 className="mb-1 text-sm font-semibold">{data.label}</h4>

          {data.type === NodeType.PERSON && (
            <div className="text-xs text-gray-600">
              {/* 在这里填充人物的更多信息，示例占位 */}
              人物：{data.label} 的详细信息…
            </div>
          )}

          {data.type === NodeType.GROUP && (
            <div className="text-xs text-gray-600">
              组织：{data.label}。当前成员数：{data.memberCount ?? "未知"}。
            </div>
          )}

          {data.type === NodeType.EVENT && (
            <div className="space-y-1 text-xs text-gray-600">
              <p>时间：{data.time}</p>
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-blue-100 px-1 py-0.5 text-[9px] text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {/* 如果需要可继续添加事件描述、来源链接等 */}
            </div>
          )}

          {data.type === NodeType.ASSETS && (
            <div className="text-xs text-gray-600">
              资产：{data.label}。当前涨跌：{data.changePercent}.
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NodeRenderer;

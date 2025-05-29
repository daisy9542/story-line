import React, { useRef } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

import { RenderNodeData } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const NodeRenderer = ({ id, data }: NodeProps<RenderNodeData>) => {
  const ref = useRef<HTMLDivElement>(null);

  // 假设 data.edgeCount 是 normalize 时算好的 data-level 边数
  const count = data.parallelCount || 1;
  const handles = Array.from({ length: count }).map((_, i) => {
    const top = ((i + 1) / (count + 1)) * 100;
    return (
      <Handle
        key={i}
        type="source"
        position={Position.Right}
        id={`${id}-s-${i}`}
        style={{ top: `${top}%`, background: "#555" }}
      />
    );
  });

  return (
    <div
      ref={ref}
      style={{
        width: data.size,
        height: data.size,
        opacity: data.opacity,
        position: "relative",
        borderRadius: "50%",
        overflow: "hidden",
        textAlign: "center",
        cursor: "pointer",
      }}
      onMouseEnter={() => {
        /* show popover */
      }}
      onMouseLeave={() => {
        /* hide popover */
      }}
    >
      <img
        src={data.showLabel ? data.img || "" : data.img || ""}
        alt={data.label}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {data.showLabel && (
        <div className="bg-opacity-50 absolute bottom-0 w-full bg-black text-xs text-white">
          {data.label}
        </div>
      )}

      {handles}

      {/* 这里插入 Radix Popover 或 shadcn/ui 的 Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <div style={{ position: "absolute", inset: 0 }} />
        </PopoverTrigger>
        <PopoverContent side="right" align="center">
          <div className="rounded bg-white p-2 shadow-lg">
            <h4 className="font-bold">{data.label}</h4>
            {data.type === "event" && (
              <>
                <p className="text-xs text-gray-500">{data.time}</p>
                <div className="flex space-x-1">
                  {data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-blue-100 px-1 text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
            {/* 更多详情… */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NodeRenderer;

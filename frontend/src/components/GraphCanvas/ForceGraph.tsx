import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Node, Link } from "@/types/graph";

interface Props {
  nodes: Node[];
  links: Link[];
}

const nodeColorPalette = [
  { fill: "#4f46e5", stroke: "#a5b4fc" }, // 深蓝 + 淡蓝
  { fill: "#0e7490", stroke: "#67e8f9" }, // 深青 + 淡青
  { fill: "#9333ea", stroke: "#d8b4fe" }, // 深紫 + 淡紫
  { fill: "#ea580c", stroke: "#fdba74" }, // 深橘 + 淡橘
  { fill: "#1d4ed8", stroke: "#93c5fd" }, // 深蓝2
  { fill: "#be185d", stroke: "#f9a8d4" }, // 深粉 + 粉红
];

function getNodeColor(id: string) {
  const hash = [...id].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = hash % nodeColorPalette.length;
  return nodeColorPalette[index];
}

const computeRadius = (num: number) => Math.max(10, Math.log(num + 10) * 2);

const ForceGraph: React.FC<Props> = ({ nodes, links }) => {
  let filteredLinks;
  // const topNodes = nodes
  //   .slice()
  //   .sort((a, b) => (b.followers ?? 0) - (a.followers ?? 0))
  //   .slice(0, 200);
  // const topNodeIds = new Set(topNodes.map((n) => n.id));
  // filteredLinks = links.filter(
  //   (link) =>
  //     topNodeIds.has((link.source as any).id ?? link.source) &&
  //     topNodeIds.has((link.target as any).id ?? link.target)
  // );

  filteredLinks = links.filter((link) => link.score !== 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const zoomGroup = svg.append("g");

    svg.call(
      d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
        zoomGroup.attr("transform", event.transform);
      })
    );

    const simulation = d3
      .forceSimulation<Node, Link>(nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(filteredLinks)
          .id((d) => d.id)
          .distance(160) // 边距离较短时，节点会更紧密地聚集在一起，形成“聚团”效果
          .strength(0.7) // 值越大，节点越倾向于保持目标距离
      )
      .force("charge", d3.forceManyBody().strength(-100)) // 排斥力，防止节点过于靠近
      .force("center", d3.forceCenter(width / 2, height / 2)) // 将所有节点的重心拉向画布的中心点
      .force(
        "radial",
        d3
          .forceRadial<Node>(
            (d) => {
              const followers = d.followers ?? 0;
              const logScale = Math.log10(followers + 10);
              const norm = Math.min(logScale / 6, 1); // 6 ~ log10(1M)
              return 50 + 50 * (1 - norm);
            },
            width / 2,
            height / 2
          )
          .strength(0.02) // 模拟径向力，将节点拉向或推离一个圆心
      )
      .force(
        "collision",
        d3
          .forceCollide<Node>()
          .radius((d) => {
            const radius = Math.log10(d.followers + 10) * 2;
            return radius;
          }) // 节点的碰撞半径
          .strength(0.8) // 值越大，节点越倾向于保持碰撞半径的距离
      );

    // 动态调整 D3 力模拟器的“衰减率”
    // 边越多，衰减越快（值越大），模拟更快完成，避免性能开销过大
    // const nodeCount = nodes.length;
    // const decay =
    //   nodeCount > 1000
    //     ? 0.9
    //     : nodeCount > 800
    //     ? 0.8
    //     : nodeCount > 600
    //     ? 0.7
    //     : nodeCount > 400
    //     ? 0.1
    //     : nodeCount > 300
    //     ? 0.05
    //     : 0.022;
    // simulation.alphaDecay(decay);

    const linkElements = zoomGroup
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      // .attr("stroke", (d) => {
      //   if (d.score > 0) return "#22c55e";
      //   else return "#ef4444";
      //   // return "#94a3b8";
      // })
      .attr("stroke", (d) => {
        if (d.score > 0) return d3.interpolateGreens(d.score / 100);
        else return d3.interpolateReds(-d.score / 100);
      })
      .attr("stroke-width", (d) => {
        const score = d.score ?? 0;
        const minWidth = 1;
        const maxWidth = 6;
        const normalized = Math.min(score / 100, 1);
        return minWidth + (maxWidth - minWidth) * normalized;
      })
      .attr("stroke-opacity", 0.9);

    const nodeGroups = zoomGroup
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", (event) => {
            if (!event.active) simulation.alphaTarget(0.1).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on("drag", (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on("end", (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

    nodeGroups
      .append("circle")
      .attr("r", (d) => computeRadius(d.followers))
      .attr("fill", (d) => getNodeColor(d.id).fill)
      .attr("stroke", (d) => getNodeColor(d.id).stroke)
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 4px rgba(255,255,255,0.15))");

    nodeGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("font-weight", "600")
      .attr("font-size", (d) => {
        const radius = computeRadius(d.followers);
        const nameLength = (d.name ?? d.id).length;

        const baseSize = 18;
        const maxSize = 24;
        const minSize = 10;

        const scaled = (radius * 1.8) / nameLength;
        const fontSize = Math.min(
          maxSize,
          Math.max(minSize, Math.min(baseSize, scaled))
        );

        return `${fontSize}px`;
      })
      .style("pointer-events", "none")
      .text((d) => d.name ?? d.id);

    simulation.on("tick", () => {
      nodeGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
      linkElements
        .attr("x1", (d) => (d.source as Node).x!)
        .attr("y1", (d) => (d.source as Node).y!)
        .attr("x2", (d) => (d.target as Node).x!)
        .attr("y2", (d) => (d.target as Node).y!);
    });
  }, [nodes, links, filteredLinks]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{
          background: "#101827",
          display: "block",
        }}
      />
    </div>
  );
};

export default ForceGraph;

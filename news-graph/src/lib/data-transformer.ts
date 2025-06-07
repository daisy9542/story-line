import {
  EventNode,
  GraphEdge,
  GraphNode,
  NodeType,
  RelatedEventNode,
} from "@/types";

export function transformDataToGraph(data: any) {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // 1. 创建中心事件节点
  const mainEventId = "main-event";
  const mainEvent: EventNode = {
    id: mainEventId,
    type: NodeType.EVENT,
    label: data.event_title,
    time: data.created_at,
    citations: data.citations,
  };
  nodes.push(mainEvent);

  // 2. 添加实体节点和边
  if (data.entities && Array.isArray(data.entities)) {
    data.entities.forEach((entity: any, index: number) => {
      const entityId = `entity-${index}`;

      // 根据实体类型确定节点类型
      let nodeType = NodeType.ENTITY;

      // 创建实体节点
      const entityNode: GraphNode = {
        id: entityId,
        type: nodeType,
        label: entity.name || entity.team, // 兼容新旧数据格式
      };

      // 如果是资产类型且有价格变动，添加到标签
      if (entity.priceChange !== undefined) {
        const priceChangeText =
          entity.priceChange > 0
            ? `+${entity.priceChange}%`
            : `${entity.priceChange}%`;

        entityNode.tags = [`涨幅: ${priceChangeText}`];
      }

      nodes.push(entityNode);

      // 创建与主事件的连接边
      edges.push({
        id: `edge-${mainEventId}-${entityId}`,
        source: mainEventId,
        target: entityId,
        relationType: entity.relation_type || entity.type, // 使用关系类型或实体类型作为边的标签
        properties: {
          parallelIndex: index,
          parallelTotal: data.entities.length,
        },
      });
    });
  }

  // 3. 添加历史类似事件节点和边
  if (
    data.historical_similar_events &&
    Array.isArray(data.historical_similar_events)
  ) {
    data.historical_similar_events.forEach((event: any, index: number) => {
      const histEventId = `historical-event-${index}`;

      // 创建历史事件节点 - 使用EVENT类型
      const histEventNode: EventNode = {
        id: histEventId,
        type: NodeType.EVENT, // 使用EVENT类型，因为这是事件而非实体
        label: event.event_title,
        time: data.created_at,
        // 添加标签显示相似原因
        tags: event.similarity_reason
          ? [`相似原因: ${event.similarity_reason}`]
          : undefined,
      };

      nodes.push(histEventNode);

      // 创建边连接主事件和历史事件
      edges.push({
        id: `edge-${mainEventId}-${histEventId}`,
        source: mainEventId,
        target: histEventId,
        relationType: "SIMILAR_TO", // 使用SIMILAR_TO关系类型
        properties: {
          parallelIndex: index,
          parallelTotal: data.historical_similar_events.length,
        },
      });
    });
  }

  return { nodes, edges };
}

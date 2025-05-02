export type CircleMarker<TimeType> = {
  time: TimeType; // 哪根柱子
  priceHigh: number; // 最高价
  priceLow: number; // 最低价
  offsetIndex: number; // 堆叠用，第 0 个贴顶/贴底，第 1 个往外偏一个半径+间隔……
  position: "aboveBar" | "belowBar"; // 画在蜡烛的上方 or 下方
  onClick?: (id: string) => void;
  onHover?: (id: string) => void;
};

## 目录结构

src/
├── assets/                  # 图片、图标、字体
├── components/              # 可复用组件（如滑条、用户卡片、气泡等）
│   ├── BubbleNode.tsx
│   ├── Sidebar/
│   │   ├── FilterSlider.tsx
│   │   ├── UserDetailPanel.tsx
│   │   └── SearchBar.tsx
│   └── GraphCanvas/
│       ├── ForceGraph.tsx
│       └── useForceGraph.ts # 自定义hook封装D3逻辑
├── pages/                   # 页面视图
│   └── GraphView.tsx        # 主要图谱可视化页面
├── services/                # 网络请求、数据处理逻辑
│   ├── api.ts
│   └── mockData.ts          # 模拟数据或mock接口
├── store/                   # 全局状态管理
│   └── graphStore.ts
├── types/                   # 全局类型定义
│   └── graph.ts
├── utils/                   # 工具函数、辅助逻辑
│   ├── d3Helpers.ts
│   └── emotionUtils.ts
├── App.tsx
└── main.tsx

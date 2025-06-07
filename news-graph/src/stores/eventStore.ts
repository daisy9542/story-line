import { create } from "zustand";

interface EventStore {
  // 当前选中的事件ID
  currentEventId: number | null;

  // 设置当前事件ID的方法
  setCurrentEvent: (id: number) => void;
}

// 创建事件状态存储
export const useEventStore = create<EventStore>((set: any) => ({
  // 初始状态
  currentEventId: null,

  // 设置当前事件的方法
  setCurrentEvent: (id: number) => {
    set({ currentEventId: id });
  },
}));

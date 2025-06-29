import { useEffect, useRef, useState, useCallback } from 'react';
import { http } from '@/lib/axios';

interface DanmakuItem {
  id: string;
  text: string;
  line: number;
  startTime: number;
  width?: number;
}

interface DanmakuProps {
  data?: string[]; // 可选的外部数据，如果不提供则从API获取
  interval?: number; // 弹幕发送间隔（毫秒），默认2000ms
  duration?: number; // 弹幕滚动时间（秒），默认12秒
  lineCount?: number; // 弹幕行数，默认3行
}

export default function Danmaku({ 
  data, 
  interval = 2000, 
  duration = 12, 
  lineCount = 3 
}: DanmakuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [danmakuData, setDanmakuData] = useState<string[]>([]);
  const [activeDanmaku, setActiveDanmaku] = useState<DanmakuItem[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取弹幕数据
  const fetchDanmakuData = useCallback(async () => {
    if (data && data.length > 0) {
      setDanmakuData(data);
      return;
    }

    try {
      const response = await http.get('/danmaku', { limit: 100 });
      if (response && Array.isArray(response)) {
        setDanmakuData(response);
      }
    } catch (error) {
      console.error('获取弹幕数据失败:', error);
      // 使用默认数据作为后备
      setDanmakuData([
        'BTC价格突破新高！',
        '市场情绪高涨',
        '投资者信心增强',
        '技术分析显示上涨趋势',
        '交易量大幅增加'
      ]);
    }
  }, [data]);

  // 创建新弹幕
  const createDanmaku = useCallback(() => {
    if (danmakuData.length === 0) return;

    // 限制同时显示的弹幕数量，避免性能问题
    setActiveDanmaku(prev => {
      if (prev.length >= 20) {
        return prev;
      }

      const text = danmakuData[Math.floor(Math.random() * danmakuData.length)];
      
      // 简单的防重叠逻辑：避免同一行在短时间内重复出现弹幕
      const now = Date.now();
      const recentDanmaku = prev.filter(item => now - item.startTime < 3000);
      const availableLines = Array.from({ length: lineCount }, (_, i) => i)
        .filter(line => !recentDanmaku.some(item => item.line === line));
      
      const line = availableLines.length > 0 
        ? availableLines[Math.floor(Math.random() * availableLines.length)]
        : Math.floor(Math.random() * lineCount);
      
      const id = `danmaku-${Date.now()}-${Math.random()}`;

      const newDanmaku: DanmakuItem = {
        id,
        text,
        line,
        startTime: now,
      };

      // 设置定时器移除弹幕
      setTimeout(() => {
        setActiveDanmaku(current => current.filter(item => item.id !== id));
      }, duration * 1000);

      return [...prev, newDanmaku];
    });
  }, [danmakuData, lineCount, duration]);

  // 初始化数据
  useEffect(() => {
    fetchDanmakuData();
  }, [fetchDanmakuData]);

  // 启动弹幕定时器
  useEffect(() => {
    if (danmakuData.length === 0) return;

    intervalRef.current = setInterval(createDanmaku, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [danmakuData, createDanmaku, interval]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-[30%] w-full overflow-hidden pointer-events-none"
      style={{ zIndex: 99999 }}
    >
      {activeDanmaku.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap text-white/60 text-sm font-medium animate-danmaku"
          style={{
            top: `${(item.line * 100) / lineCount}%`,
            lineHeight: `${100 / lineCount}%`,
            animationDuration: `${duration}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
} 
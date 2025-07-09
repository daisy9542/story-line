import { useEffect, useRef, useState, useCallback } from 'react';
import { http } from '@/lib/axios';
import { INewsEvent } from '@/types/report';

interface DanmakuItem {
  id: string;
  text: string;
  line: number;
  startTime: number;
  isGuide?: boolean; // 是否为引导弹幕
  type?: 'hotspot' | 'expert' | 'guide'; // 弹幕类型
  entity?: string; // 专家/实体名称
  sentiment?: number; // 情绪评分 (-1 到 1)
  hasUrl?: boolean; // 是否有来源链接
  isPaused?: boolean; // 是否暂停
  isRemoving?: boolean; // 是否正在移除（用于优雅过渡）
}

interface DanmakuProps {
  selectedEvent?: INewsEvent | null; // 选中的事件，用于显示专家观点
  interval?: number; // 弹幕发送间隔（毫秒），默认2500ms
  duration?: number; // 弹幕滚动时间（秒），默认12秒
  lineCount?: number; // 弹幕行数，默认4行
}

export default function Danmaku({ 
  selectedEvent,
  interval = 2500, // 弹幕间隔
  duration = 18, // 增加滚动时间，让弹幕更慢
  lineCount = 4
}: DanmakuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hotspotData, setHotspotData] = useState<string[]>([]);
  const [activeDanmaku, setActiveDanmaku] = useState<DanmakuItem[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set()); // 跟踪所有弹幕移除定时器
  const startupTimeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set()); // 跟踪启动延迟定时器
  const [hasShownHotspotGuide, setHasShownHotspotGuide] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<'hotspot' | 'expert' | null>(null);

  // 获取今日热点数据
  const fetchHotspotData = useCallback(async () => {
    try {
      const response = await http.get('/danmaku', { limit: 50 });
      if (response && Array.isArray(response)) {
        setHotspotData(response);
      }
    } catch (error) {
      console.error('获取弹幕数据失败:', error);
    }
  }, []);

  // 停止生成新弹幕并立即清空现有弹幕
  const stopAndClearDanmaku = useCallback(() => {
    console.log('🧹 清理所有弹幕和定时器');

    // 停止新弹幕的生成
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('✅ 清理弹幕生成定时器');
    }

    // 清理所有启动延迟定时器，防止之前安排的启动回调执行
    console.log(`🕐 清理 ${startupTimeoutRefs.current.size} 个启动延迟定时器`);
    startupTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    startupTimeoutRefs.current.clear();

    // 清理所有弹幕移除定时器
    console.log(`⏰ 清理 ${timeoutRefs.current.size} 个弹幕移除定时器`);
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();

    // 立即清空所有现有弹幕
    setActiveDanmaku([]);
    console.log('🗑️ 清空所有现有弹幕');
  }, []);

  // 重置热点引导状态（只在切换回热点模式时使用）
  const resetHotspotGuide = useCallback(() => {
    setHasShownHotspotGuide(false);
  }, []);



  // 创建弹幕
  const createDanmaku = useCallback((
    text: string,
    type: 'hotspot' | 'expert' | 'guide' = 'hotspot',
    entity?: string,
    sentiment?: number,
    hasUrl?: boolean
  ) => {
    console.log(`🎯 创建弹幕: [${type}] ${text.substring(0, 20)}... (持续时间: ${duration}s)`);
    setActiveDanmaku(prev => {
      // 限制最多5条弹幕，避免专家观点弹幕过于拥挤
      if (prev.length >= 5) {
        return prev;
      }

      const now = Date.now();
      
      let line: number;
      if (type === 'guide') {
        // 引导弹幕固定在第一行（顶部）
        line = 0;
        console.log('🎯 引导弹幕分配到第一行');
      } else {
        // 常规弹幕找到可用的行（严格避开第一行）
        const recentDanmaku = prev.filter(item => now - item.startTime < 3000);
        const availableLines = Array.from({ length: lineCount - 1 }, (_, i) => i + 1) // 只使用第2-4行
          .filter(line => !recentDanmaku.some(item => item.line === line));
      
        line = availableLines.length > 0
          ? availableLines[Math.floor(Math.random() * availableLines.length)]
          : Math.floor(Math.random() * (lineCount - 1)) + 1; // 随机选择第2-4行

        console.log(`📝 常规弹幕分配到第${line + 1}行`);
      }

      const id = `danmaku-${Date.now()}-${Math.random()}`;

      const newDanmaku: DanmakuItem = {
        id,
        text,
        line,
        startTime: now,
        isGuide: type === 'guide',
        type,
        entity,
        sentiment,
        hasUrl,
      };

      // 设置定时器移除弹幕
      const timeoutId = setTimeout(() => {
        setActiveDanmaku(current => current.filter(item => item.id !== id));
        timeoutRefs.current.delete(timeoutId); // 从跟踪集合中移除
      }, duration * 1000);

      // 跟踪这个定时器
      timeoutRefs.current.add(timeoutId);

      return [...prev, newDanmaku];
    });
  }, [lineCount, duration]);

  // 启动今日热点弹幕
  const startHotspotDanmaku = useCallback(() => {
    if (hotspotData.length === 0) return;

    console.log('🔥 启动热点弹幕');
    setCurrentMode('hotspot');

    // 只有在没有显示过引导弹幕时才显示
    if (!hasShownHotspotGuide) {
      createDanmaku('🔥 今日热点', 'guide');
      setHasShownHotspotGuide(true);
    }

    // 延迟500ms后开始显示热点内容（更快响应）
    const startupTimeoutId = setTimeout(() => {
      // 再次检查当前模式，防止在延迟期间模式被切换
      if (currentMode !== 'hotspot') {
        console.log('🚫 热点弹幕启动被取消，当前模式已切换');
        return;
      }
      intervalRef.current = setInterval(() => {
        // 每次生成前检查模式
        if (currentMode !== 'hotspot') {
          console.log('🚫 停止热点弹幕生成，模式已切换');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        const randomText = hotspotData[Math.floor(Math.random() * hotspotData.length)];
        createDanmaku(randomText, 'hotspot');
      }, interval);
      startupTimeoutRefs.current.delete(startupTimeoutId); // 执行后从跟踪集合中移除
    }, 500);

    // 跟踪这个启动定时器
    startupTimeoutRefs.current.add(startupTimeoutId);
  }, [hotspotData, createDanmaku, interval, hasShownHotspotGuide, currentMode]);

  // 启动专家观点弹幕
  const startExpertViewsDanmaku = useCallback((event: INewsEvent) => {
    if (!event.viewpoint || event.viewpoint.length === 0) return;

    console.log('🎯 启动专家观点弹幕');
    setCurrentMode('expert');

    // 首先显示引导弹幕
    createDanmaku('💬 专家观点', 'guide');

    // 延迟1500ms后开始显示专家观点内容，让引导弹幕先飘一会
    const startupTimeoutId = setTimeout(() => {
      let viewIndex = 0;
      const showNextViewpoint = () => {
        if (viewIndex < event.viewpoint.length) {
          const view = event.viewpoint[viewIndex];

          // 计算情绪评分（基于事件整体情绪）
          const sentiment = event.overall_sentiment_score;

          createDanmaku(
            view.viewpoint,
            'expert',
            view.entity, // 显示实体名称
            sentiment,
            !!view.source_url
          );
          viewIndex++;
        } else {
          // 所有观点显示完毕，重新开始
          viewIndex = 0;
        }
      };

      // 立即显示第一条专家观点
      showNextViewpoint();

      // 然后设置定时器显示后续观点
      intervalRef.current = setInterval(showNextViewpoint, interval);
      startupTimeoutRefs.current.delete(startupTimeoutId);
    }, 800); // 延迟0.8秒，让引导弹幕先飘一会

    // 跟踪这个启动定时器
    startupTimeoutRefs.current.add(startupTimeoutId);
  }, [createDanmaku, interval]);

  // 监听选中事件变化
  useEffect(() => {
    const eventId = selectedEvent?.id?.toString() || null;

    if (eventId !== currentEventId) {
      setCurrentEventId(eventId);

      // 立即清空所有弹幕
      stopAndClearDanmaku();

      // 立即启动新模式，不延迟
      if (selectedEvent && selectedEvent.viewpoint && selectedEvent.viewpoint.length > 0) {
        // 切换到专家观点：立即启动专家观点
        startExpertViewsDanmaku(selectedEvent);
      } else if (hotspotData.length > 0) {
        // 切换回热点或无选中：重置引导状态，立即启动热点
        resetHotspotGuide();
        startHotspotDanmaku();
      }
    }
  }, [selectedEvent, currentEventId, stopAndClearDanmaku, startExpertViewsDanmaku, startHotspotDanmaku, resetHotspotGuide, hotspotData]);

  // 初始化数据
  useEffect(() => {
    fetchHotspotData();
  }, [fetchHotspotData]);

  // 启动初始弹幕
  useEffect(() => {
    if (hotspotData.length > 0 && !selectedEvent && !currentEventId) {
      startHotspotDanmaku();
    }
  }, [hotspotData, selectedEvent, currentEventId, startHotspotDanmaku]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // 清理所有弹幕移除定时器
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current.clear();
      // 清理所有启动延迟定时器
      startupTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      startupTimeoutRefs.current.clear();
    };
  }, []);

  // 根据情绪评分获取颜色
  const getSentimentColor = (sentiment?: number) => {
    if (!sentiment) return 'text-white/70';
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };



  // 根据弹幕类型获取样式
  const getDanmakuStyle = (item: DanmakuItem) => {
    switch (item.type) {
      case 'guide':
        return 'text-white font-semibold text-base bg-gradient-to-r from-blue-600/30 to-purple-600/30 px-4 py-2 rounded-lg border border-blue-400/40 shadow-lg backdrop-blur-sm';
      case 'expert':
        const sentimentColor = getSentimentColor(item.sentiment);
        const bgGradient = item.sentiment && item.sentiment > 0.3
          ? 'from-green-500/20 to-emerald-500/20'
          : item.sentiment && item.sentiment < -0.3
          ? 'from-red-500/20 to-rose-500/20'
          : 'from-blue-500/20 to-purple-500/20';
        return `${sentimentColor} font-medium bg-gradient-to-r ${bgGradient} px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm`;
      default:
        return 'text-white/80 bg-gradient-to-r from-gray-800/40 to-gray-700/40 px-4 py-1.5 rounded-lg border border-gray-600/30 backdrop-blur-sm';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute overflow-hidden pointer-events-none"
      style={{
        zIndex: 99999,
        height: '30%',
        top: '5%',
        left: '2%',
        width: '96%',
      }}
    >
      {activeDanmaku.map((item) => (
        <div
          key={item.id}
          className={`absolute whitespace-nowrap text-sm animate-danmaku ${getDanmakuStyle(item)} ${
            item.isPaused ? 'animation-paused' : ''
          }`}
          style={{
            top: item.type === 'guide' ? '5%' : `${(item.line * 80) / lineCount + 10}%`, // 引导弹幕固定在顶部
            lineHeight: `${80 / lineCount}%`,
            animationDuration: `${duration}s`, // 所有弹幕使用相同的18秒持续时间
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationPlayState: item.isPaused ? 'paused' : 'running',

          }}
          onMouseEnter={() => {
            setActiveDanmaku(prev =>
              prev.map(d => d.id === item.id ? { ...d, isPaused: true } : d)
            );
          }}
          onMouseLeave={() => {
            setActiveDanmaku(prev =>
              prev.map(d => d.id === item.id ? { ...d, isPaused: false } : d)
            );
          }}
        >
          {item.type === 'expert' && item.entity && (
            <span className="inline-flex items-center mr-2">
              <span className="text-blue-300 font-semibold text-xs">{item.entity}</span>
              <span className="text-gray-400 mx-1">:</span>
            </span>
          )}
          <span>{item.text}</span>
          {item.hasUrl && (
            <span className="ml-1 text-blue-300">🔗</span>
          )}
          {item.type === 'expert' && item.sentiment !== undefined && (
            <span className="ml-2 text-xs">
              {item.sentiment > 0.3 ? '📈' : item.sentiment < -0.3 ? '📉' : '➡️'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
} 
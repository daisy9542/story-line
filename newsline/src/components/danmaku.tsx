import { useEffect, useRef } from 'react';

interface DanmakuProps {
  data: number[];
}

export default function Danmaku({ data }: DanmakuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const duration = 10; // 滚动一次的时间（秒）

    const createDanmaku = (text: string, top: number) => {
      const danmaku = document.createElement('div');
      danmaku.textContent = text;
      danmaku.style.position = 'absolute';
      danmaku.style.whiteSpace = 'nowrap';
      danmaku.style.left = `${containerWidth}px`;
      danmaku.style.top = `${top}px`;
      danmaku.style.color = 'white';
      danmaku.style.opacity = '0.5';
      danmaku.style.transition = `transform ${duration}s linear`;
      danmaku.style.zIndex = '99999';
      container.appendChild(danmaku);

      // 开始动画
      requestAnimationFrame(() => {
        danmaku.style.transform = `translateX(-${containerWidth + danmaku.offsetWidth}px)`;
      });

      // 动画结束后移除元素
      setTimeout(() => {
        container.removeChild(danmaku);
      }, duration * 1000);
    };

    // 创建三行弹幕
    const interval = setInterval(() => {
      const randomText = data[Math.floor(Math.random() * data.length)].toString();
      const lineHeight = container.offsetHeight / 3;
      const randomLine = Math.floor(Math.random() * 3);
      createDanmaku(randomText, randomLine * lineHeight);
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-[30%] w-full overflow-hidden"
      style={{ pointerEvents: 'none', zIndex: 99999 }}
    />
  );
} 
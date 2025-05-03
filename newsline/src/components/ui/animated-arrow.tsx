import { motion } from "motion/react";
import React from "react";

interface AnimatedCurvedArrowProps {
  width?: string | number;
  height?: string | number;
  duration?: number;
}

export const AnimatedArrow: React.FC<AnimatedCurvedArrowProps> = ({
  width = "100%",
  height = "100%",
}) => {
  // 路径是 0→80 高度的曲线，dashLength 要略大于实际 path length (这里用 120 保证足够)
  const dashLength = 120;

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 24 80"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
    >
      <motion.path
        d="M12,0 C12,20 20,40 12,80
           M12,80 L6,74
           M12,80 L18,74"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashLength}
        strokeDashoffset={dashLength}
        animate={{ strokeDashoffset: [dashLength, 0] }}
      />
    </motion.svg>
  );
};

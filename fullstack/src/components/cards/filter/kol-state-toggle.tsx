import { motion } from "framer-motion";

type KolState = "excluded" | "neutral" | "interested";

interface ThreeStateSwitchProps {
  value: KolState;
  onChange: (val: KolState) => void;
}

export function KolStateToggle({ value, onChange }: ThreeStateSwitchProps) {
  const SLIDER_WIDTH = 60;
  const THUMB_WIDTH = 18;
  const GAP = (SLIDER_WIDTH - THUMB_WIDTH * 3) / 2;

  const getOffset = (value: KolState) => {
    switch (value) {
      case "excluded":
        return 0;
      case "neutral":
        return THUMB_WIDTH + GAP;
      case "interested":
        return (THUMB_WIDTH + GAP) * 2 - 4;
    }
  };

  return (
    <div className="relative flex h-6 w-[60px] items-center rounded-full bg-zinc-800 px-[2px]">
      <motion.div
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute top-[3px] h-[18px] w-[18px] rounded-full shadow-md"
        style={{
          backgroundColor:
            value === "interested"
              ? "#10B981"
              : value === "excluded"
                ? "#EF4444"
                : "#9CA3AF",
        }}
        animate={{ x: getOffset(value) }}
      />
      <div className="absolute inset-0 z-10 flex">
        {(["excluded", "neutral", "interested"] as KolState[]).map((state) => (
          <button
            key={state}
            onClick={() => onChange(state)}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useKolStore } from "@/stores/kol-store";
import dayjs from "dayjs";
import debounce from "lodash.debounce";
import { ChevronDown, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Granularity = "day" | "month" | "year";

const maxByGranularity: Record<Granularity, number> = {
  day: 100,
  month: 36,
  year: 10,
};

export default function TimeSlider() {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const max = maxByGranularity["day"];
  const [sliderValue, setSliderValue] = useState(max);
  // const [dateTime, setDateTime] = useState(dayjs().format("YYYY-MM-DDTHH:00"));
  const maxTimestamp = 1743544033000; // 离线数据的最大时间戳
  const [dateTime, setDateTime] = useState(
    dayjs(maxTimestamp).format("YYYY-MM-DDTHH:00"),
  );
  const { setNeedRefresh, setFilterTime, setFilterChanged } = useKolStore();
  const [showGranularityOptions, setShowGranularityOptions] = useState(false);
  const granularities = [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // 使用 ref 保证只在首次渲染时创建 debounce 函数
  const debouncedRefresh = useRef(
    debounce(() => {
      setNeedRefresh(true);
    }, 300),
  ).current;

  // 卸载时取消未执行的 debounce 调用
  useEffect(() => {
    return () => {
      debouncedRefresh.cancel();
    };
  }, [debouncedRefresh]);

  const handleSliderChange = (value: number[]): void => {
    const newValue = value[0];
    setSliderValue(newValue);
    const unit = granularity;
    const max = maxByGranularity[granularity];
    // const newDate = dayjs().subtract(max - newValue, unit);
    const newDate = dayjs(maxTimestamp).subtract(max - newValue, unit);
    setDateTime(newDate.format("YYYY-MM-DDTHH:ss"));
    setFilterTime(newDate.valueOf());
    setFilterChanged(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;

    const newTime = dayjs(inputValue).valueOf();

    // 限制不能超过最大时间戳
    const cappedTime = Math.min(newTime, maxTimestamp);
    setDateTime(dayjs(cappedTime).format("YYYY-MM-DDTHH:ss"));

    setFilterTime(cappedTime);
    setFilterChanged(true);
  };

  const handleGranularityChange = (value: Granularity): void => {
    const max = maxByGranularity[value];
    setGranularity(value);
    setSliderValue(max);
    // setDateTime(dayjs().format("YYYY-MM-DDTHH:ss"));
    // setFilterTime(dayjs().valueOf());
    setDateTime(dayjs(maxTimestamp).format("YYYY-MM-DDTHH:ss"));
    setFilterTime(maxTimestamp);
  };

  return (
    <div className="space-y-2">
      <div className="flex h-8 items-center justify-between space-y-1">
        <div className="text-sm">Time</div>
        <div className="flex h-full gap-2">
          <Input
            id="datetime"
            type="datetime-local"
            value={dateTime}
            onChange={handleDateChange}
            className="flex h-8 w-36 appearance-none justify-center text-center [&::-webkit-calendar-picker-indicator]:hidden"
          />

          <Button
            variant="outline"
            className="h-full w-4 text-xs"
            onClick={() => setShowGranularityOptions((prev) => !prev)}
          >
            {showGranularityOptions ? <ChevronDown /> : <ChevronLeft />}
          </Button>
        </div>
      </div>
      {showGranularityOptions && (
        <div className="mt-2 w-full">
          <ToggleGroup
            type="single"
            value={granularity}
            onValueChange={(value) =>
              value && handleGranularityChange(value as Granularity)
            }
            className="flex justify-evenly"
          >
            {granularities.map((item) => (
              <ToggleGroupItem
                key={item.value}
                value={item.value}
                className={cn(
                  "h-8 rounded-full px-3 text-xs text-muted-foreground transition",
                  "data-[state=on]:bg-[#1f1f1f] data-[state=on]:text-white dark:data-[state=on]:bg-[#333] dark:data-[state=on]:text-white",
                )}
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      <Slider
        value={[sliderValue]}
        onValueChange={(val) => {
          debouncedRefresh();
          handleSliderChange(val);
        }}
        max={maxByGranularity[granularity]}
        step={1}
      />
    </div>
  );
}

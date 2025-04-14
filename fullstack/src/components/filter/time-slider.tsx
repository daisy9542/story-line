"use client";

import { useState } from "react";
import dayjs from "dayjs";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function TimeSlider() {
  const [sliderValue, setSliderValue] = useState(30);
  const [dateTime, setDateTime] = useState(dayjs().format("YYYY-MM-DDTHH:00"));
  const maxDay = 100;

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setSliderValue(newValue);
    const newDate = dayjs().subtract(maxDay - newValue, "day");
    setDateTime(newDate.format("YYYY-MM-DDTHH:00"));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="datetime">Time</Label>
        <Input
          id="datetime"
          type="datetime-local"
          value={dateTime}
          onChange={handleDateChange}
          className="w-48"
        />
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={handleSliderChange}
        max={maxDay}
        step={1}
        className="w-full"
      />
    </div>
  );
}

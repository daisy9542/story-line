"use client";

import { useState } from "react";
import { useKolStore } from "@/stores/kol-store";
import dayjs from "dayjs";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

type Granularity = "day" | "month" | "year";

const maxByGranularity: Record<Granularity, number> = {
  day: 100,
  month: 36,
  year: 10,
};

export default function TimeSlider() {
  const [open, setOpen] = useState(false);
  const [granularity, setGranularity] = useState<Granularity>("day");
  const max = maxByGranularity["day"];
  const [sliderValue, setSliderValue] = useState(max);
  const [dateTime, setDateTime] = useState(dayjs().format("YYYY-MM-DDTHH:00"));
  const { setFilterTime, setFilterChanged } = useKolStore();
  const granularities = [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const handleSliderChange = (value: number[]): void => {
    const newValue = value[0];
    setSliderValue(newValue);
    const unit = granularity;
    const max = maxByGranularity[granularity];
    const newDate = dayjs().subtract(max - newValue, unit);
    setDateTime(newDate.format("YYYY-MM-DDTHH:ss"));
    setFilterTime(newDate.valueOf());
    setFilterChanged(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDateTime(e.target.value);
  };

  const handleGranularityChange = (value: Granularity): void => {
    const max = maxByGranularity[value];
    setGranularity(value);
    setSliderValue(max);
    setDateTime(dayjs().format("YYYY-MM-DDTHH:ss"));
    setFilterTime(dayjs().valueOf());
  };

  return (
    <div className="space-y-2">
      <div className="mb-3 flex h-8 items-center justify-between space-y-1">
        <div className="text-sm">Time</div>
        <div className="flex h-full gap-2">
          <Input
            id="datetime"
            type="datetime-local"
            value={dateTime}
            onChange={handleDateChange}
            className="flex h-8 w-36 appearance-none justify-center text-center [&::-webkit-calendar-picker-indicator]:hidden"
          />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="h-full w-6 p-0"
              >
                <ChevronsUpDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[100px] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {granularities.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        onSelect={(val) => {
                          handleGranularityChange(val as Granularity);
                          setOpen(false);
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            granularity === item.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Slider
        value={[sliderValue]}
        onValueChange={handleSliderChange}
        max={maxByGranularity[granularity]}
        step={1}
      />
    </div>
  );
}

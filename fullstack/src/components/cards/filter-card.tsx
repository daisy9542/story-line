"use client";

import { List } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import KolSearch from "@/components/filter/kol-search";
import TimeSlider from "@/components/filter/time-slider";

type SidebarProps = {
  isOpen?: boolean;
  onToggle?: () => void;
};

const FilterCard = ({ isOpen = true, onToggle = () => {} }: SidebarProps) => {
  return (
    <div className="relative">
      {/* 折叠按钮 */}
      {/* <div
        className={`absolute right-[5px] top-2 z-10 flex flex-col gap-2 p-4 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-[-405px]" : "translate-x-[-5px]"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          // className="rounded-lg"
        >
          <List />
        </Button>
      </div> */}

      {/* 侧边栏 */}
      <Card>
        <CardContent>
          <div className="flex w-full flex-col gap-4 py-4">
            <KolSearch />

            <div className="space-y-2">
              <p className="text-sm font-medium">Followers</p>
              <Slider defaultValue={[1000]} max={100000} step={1000} />
            </div>

            <TimeSlider />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterCard;

"use client";

import { useKolStore } from "@/stores/kol-store";
import { Loader2 } from "lucide-react";

import { SimpleKOL } from "@/types/kol";
import { formatDigital } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import KolSearch from "@/components/cards/filter/kol-search";
import TimeSlider from "@/components/cards/filter/time-slider";

type SidebarProps = {
  kols: SimpleKOL[];
  isLoading: boolean;
  onFilterChange: (cb?: () => void) => void;
};

const FilterCard = ({ kols, isLoading, onFilterChange }: SidebarProps) => {
  const {
    filterFollowers,
    setFilterFollowers,
    filterChanged,
    setFilterChanged,
  } = useKolStore();
  return (
    <div className="relative">
      <Card>
        <CardContent>
          <div className="mb-3 flex h-52 w-full flex-col gap-4 py-4">
            <KolSearch kols={kols} />
            <div className="h-8 space-y-2">
              <p className="text-sm">
                Followers
                <span className="text-muted-foreground">
                  {" "}
                  ≥ {formatDigital(filterFollowers)}
                </span>
              </p>
              <Slider
                defaultValue={[filterFollowers]}
                min={1000}
                max={100000}
                step={1000}
                onValueChange={(val) => {
                  setFilterFollowers(val[0]);
                  setFilterChanged(true);
                }}
              />
            </div>
            <TimeSlider />
            <Button
              disabled={!filterChanged || isLoading}
              onClick={() => {
                onFilterChange(() => setFilterChanged(false));
                setFilterChanged(false)
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Loading
                </>
              ) : (
                <>Apply</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterCard;

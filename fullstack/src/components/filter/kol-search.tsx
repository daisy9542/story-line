"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const items = [
  { label: "Vitalik" },
  { label: "Elon Musk" },
  { label: "SBF" },
  { label: "CZ Binance" },
  { label: "Andre Cronje" },
];

export default function KolSearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative w-full max-w-md rounded-lg border bg-background text-foreground shadow-sm">
      <Command>
        <CommandInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search KOL..."
          className="h-10"
        />
        {isFocused && (
          <CommandList
            className={cn(
              "absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md",
              "max-h-60 overflow-auto",
            )}
          >
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {items.map((item) => (
                <CommandItem
                  key={item.label}
                  value={item.label}
                  onSelect={(value) => setSelected(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === item.label ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}

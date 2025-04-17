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
import { SimpleKOL } from "@/types/kol";

export interface KolSearchProps {
  kols: SimpleKOL[];
}

export default function KolSearch({kols}: KolSearchProps) {
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
              {kols.map((kol) => (
                <CommandItem
                  key={kol.id}
                  value={kol.username}
                  onSelect={(value) => setSelected(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected === kol.username ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {kol.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}

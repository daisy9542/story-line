"use client";

import { useState } from "react";
import { useKolStore } from "@/stores/kol-store";
import { Check } from "lucide-react";

import { SimpleKOL } from "@/types/kol";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface KolSearchProps {
  kols: SimpleKOL[];
}

export default function KolSearch({ kols }: KolSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { selectedKol, setSelectedKol } = useKolStore();

  const handleKolChange = (kolId: SimpleKOL | null) => {
    kolId !== null && setSelectedKol(kolId);
  };

  return (
    <div className="relative w-full max-w-md rounded-lg border bg-background text-foreground shadow-sm">
      <Command>
        <CommandInput
          onFocus={() => {
            setIsFocused(true);
            setSelectedKol(null);
          }}
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
            <CommandGroup>
              {kols.map((kol) => (
                <CommandItem
                  key={kol.id}
                  value={kol.username}
                  onSelect={() => setSelectedKol(kol)}
                  onClick={() => handleKolChange(kol)}
                  className="cursor-pointer p-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedKol?.id === kol.id ? "opacity-100" : "opacity-0",
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

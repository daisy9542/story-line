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
  const { selectedKolId, setSelectedKolId } = useKolStore();

  const handleKolChange = (kolId: number | null) => {
    setSelectedKolId(kolId);
  };

  return (
    <div className="relative w-full max-w-md rounded-lg border bg-background text-foreground shadow-sm">
      <Command>
        <CommandInput
          onFocus={() => {
            setIsFocused(true);
            setSelectedKolId(null);
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
                  onSelect={() => setSelectedKolId(kol.id)}
                  onClick={() => handleKolChange(kol.id)}
                  className="cursor-pointer p-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedKolId === kol.id ? "opacity-100" : "opacity-0",
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

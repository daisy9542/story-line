"use client";

import { useNewslineStore } from "@/stores/newsline-store";

import { TokenSymbol } from "@/types/newsline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TokenSelector = () => {
  const { selectedTokenSymbol, setSelectedTokenSymbol } =
    useNewslineStore();

  const tokenOptions: TokenSymbol[] = ["BTC", "ETH", "SOL"];

  return (
    <Select
      value={selectedTokenSymbol}
      onValueChange={(val: TokenSymbol) => {
        setSelectedTokenSymbol(val);
      }}
    >
      <SelectTrigger className="w-20">
        <SelectValue placeholder="ALL" />
      </SelectTrigger>
      <SelectContent>
        {tokenOptions.map((token) => (
          <SelectItem key={token} value={token}>
            {token}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TokenSelector;

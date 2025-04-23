"use client";

import { useKolStore } from "@/stores/kol-store";

import { TokenSymbol } from "@/types/graph";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TokenSelector = () => {
  const { setNeedRefresh, selectedTokenSymbol, setSelectedTokenSymbol } =
    useKolStore();

  const tokenOptions: TokenSymbol[] = ["BTC", "ETH", "SOL"];

  return (
    <Select
      value={selectedTokenSymbol}
      onValueChange={(val: TokenSymbol) => {
        setSelectedTokenSymbol(val);
        setNeedRefresh(true);
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

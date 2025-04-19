"use client";

import { useKolStore } from "@/stores/kol-store";

import { TokenSymbol } from "@/types/token-symbol";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TokenSelector = () => {
  const {
    selectedTokenSymbol: selectedToken,
    setSelectedTokenSymbol: setSelectedToken,
  } = useKolStore();

  const tokenOptions: TokenSymbol[] = ["BTC", "ETH", "SOL"];

  return (
    <Select value={selectedToken} onValueChange={setSelectedToken}>
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

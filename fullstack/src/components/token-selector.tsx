"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TokenSelector = () => {
  const [token, setToken] = useState("ALL");

  return (
    <Select value={token} onValueChange={setToken}>
      <SelectTrigger className="w-20">
        <SelectValue placeholder="ALL" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">ALL</SelectItem>
        <SelectItem value="SOL">SOL</SelectItem>
        <SelectItem value="BTC">BTC</SelectItem>
        <SelectItem value="ETH">ETH</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TokenSelector;

import { okxHttp } from "@/http/server";
import { useQuery } from "@tanstack/react-query";

import { CandleRequestParams } from "@/types/candlestick";

export function useCandleQuery(params: CandleRequestParams) {
  return useQuery({
    queryKey: ["candle", params],
    queryFn: async () => {
      const res = await okxHttp.get("/v5/market/candles", {
        ...params,
      });
      return res.data ?? [];
    },
    enabled: !!params.instId,
  });
}

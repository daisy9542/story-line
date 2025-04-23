import { useCallback, useEffect, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import { LoaderCircle, Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";

import { SimpleKOL } from "@/types/kol";
import { Input } from "@/components/ui/input";
import { KolStateToggle } from "@/components/cards/filter/kol-state-toggle";

export interface KolSearchProps {
  kols: SimpleKOL[]; // 已有用户列表
}

export default function KolSearch({ kols: initialKols }: KolSearchProps) {
  const [query, setQuery] = useState("");
  const [searchedKols, setSearchedKols] = useState<SimpleKOL[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);

  const {
    setNeedRefresh,
    setSelectedKol,
    interestedKolIds,
    excludedKolIds,
    addInterestedKolId,
    addExcludedKolId,
    removeInterestedKolId,
    removeExcludedKolId,
  } = useKolStore();

  useEffect(() => {
    setNeedRefresh(true);
  }, [interestedKolIds]);

  // 发起搜索请求
  const fetchSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const data = await http.get<SimpleKOL[]>("/user/search", { query });
      setSearchedKols(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed) {
      fetchSearch(trimmed);
    } else {
      setSearchedKols([]);
    }
  }, [debouncedQuery, fetchSearch]);

  return (
    <div className="relative w-full max-w-md rounded-lg border bg-background text-foreground shadow-sm">
      <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </div>
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search KOL..."
        className="h-10 w-full pl-9 pr-10"
      />
      {query.length > 0 && (
        <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
          {/* 加载中骨架屏 */}
          {isLoading && (
            <div className="space-y-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          )}

          {/* 无结果提示 */}
          {!isLoading && searchedKols.length === 0 && (
            <div className="p-3 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}

          {/* 正常展示搜索结果 */}
          {!isLoading &&
            searchedKols.length > 0 &&
            searchedKols.map((kol) => {
              const inInitial = initialKols.some((i) => i.id === kol.id);
              const isExcluded = excludedKolIds.includes(kol.id);

              return (
                <div
                  key={kol.id}
                  className="flex items-center justify-between px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div
                    className={`flex w-0 flex-grow flex-col ${
                      inInitial && !isExcluded
                        ? "cursor-pointer"
                        : "cursor-default opacity-50"
                    }`}
                    onClick={() =>
                      inInitial && !isExcluded && setSelectedKol(kol)
                    }
                  >
                    <span className="truncate font-medium">{kol.name}</span>
                    <span className="text-xs text-muted-foreground">
                      @{kol.username}
                    </span>
                  </div>

                  <div className="relative flex items-center space-x-2">
                    <KolStateToggle
                      value={
                        isExcluded
                          ? "excluded"
                          : interestedKolIds.includes(kol.id)
                            ? "interested"
                            : "neutral"
                      }
                      onChange={(val) => {
                        if (val === "interested") addInterestedKolId(kol.id);
                        else if (val === "excluded") addExcludedKolId(kol.id);
                        else {
                          removeInterestedKolId(kol.id);
                          removeExcludedKolId(kol.id);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

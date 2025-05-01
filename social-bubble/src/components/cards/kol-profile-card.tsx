import { useEffect, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import { BadgeCheck, ShieldCheck } from "lucide-react";

import { KOL, SimpleKOL } from "@/types/kol";
import { formatDigital, score2color } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface KolProfileCardProps {
  kol: SimpleKOL;
  kols: SimpleKOL[];
  kolTargetMap: Record<string, string[]>;
  isSource: boolean;
}

export default function KolProfileCard({
  kol,
  kols,
  kolTargetMap,
  isSource,
}: KolProfileCardProps) {
  const [kolInfo, setKolInfo] = useState<KOL | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { showLess, setTargetKol, setTargetHoveredKol } = useKolStore();

  function VerifiedBadge({ type }: { type: string }) {
    const map = {
      blue: { icon: BadgeCheck, bg: "#1DA1F2" },
      business: { icon: ShieldCheck, bg: "#FFAD1F" },
      organization: { icon: ShieldCheck, bg: "#FFAD1F" },
      government: { icon: ShieldCheck, bg: "#828282" },
    };

    const conf = map[type as keyof typeof map];
    if (!conf) return null;

    const Icon = conf.icon;

    return (
      <div className="relative h-5 w-5">
        <div
          className="absolute inset-0 m-auto flex h-4 w-4 items-center justify-center rounded-full"
          style={{ backgroundColor: conf.bg }}
        >
          <Icon className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
      </div>
    );
  }

  useEffect(() => {
    setLoading(true);
    http
      .get<KOL>("/user", { id: kol.id })
      .then(setKolInfo)
      .finally(() => {
        setLoading(false);
      });
  }, [kol.id]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!kolInfo) return null;

  return (
    <div className="space-y-2">
      <div className="flex h-11">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate font-semibold">{kolInfo.name}</span>
            <div className="relative h-5 w-5 flex-shrink-0">
              <VerifiedBadge type={kolInfo.verified_type} />
            </div>
          </div>
          <div className="truncate text-sm text-muted-foreground">
            <span>@{kolInfo.username}</span>
          </div>
        </div>
        <div
          className="flex w-10 items-center justify-center rounded-md px-2 py-0.5 text-sm font-semibold"
          style={{
            color: score2color(kol.score_metrics, 1).fillColor,
          }}
        >
          {formatDigital(kol.score_metrics, 0)}
        </div>
      </div>
      {!showLess && (
        <>
          <div>
            <p
              className={`whitespace-pre-wrap break-words text-sm text-foreground ${expanded ? "" : "line-clamp-3"}`}
            >
              {kolInfo.bio}
            </p>

            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-sm font-medium text-blue-500 hover:underline"
            >
              {expanded ? "Collapse" : "Show more"}
            </button>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">
                {formatDigital(kolInfo.friendsCount)}
              </span>{" "}
              <span>Following</span>
            </span>
            <span>
              <span className="font-semibold text-foreground">
                {formatDigital(kolInfo.followers)}
              </span>{" "}
              <span>Followers</span>
            </span>
          </div>
        </>
      )}
      {isSource && (
        <div>
          {kol && kolTargetMap[kol.id] ? (
            <div className="flex h-8 gap-2">
              <div className="flex w-6 items-center text-sm">To</div>
              <Select
                onValueChange={(id) => {
                  const selected = kols.find((kol) => kol.id === id)!;
                  setTargetKol(selected);
                }}
              >
                <SelectTrigger className="h-full max-w-48 text-sm">
                  <SelectValue placeholder="Select a target kol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {kolTargetMap[kol.id].map((id) => (
                      <SelectItem
                        key={id}
                        value={id}
                        onMouseEnter={() => {
                          setTargetHoveredKol(
                            kols.find((kol) => kol.id === id)!,
                          );
                        }}
                        onMouseLeave={() => {
                          setTargetHoveredKol(null);
                        }}
                        className="cursor-pointer"
                      >
                        @{kols.find((kol) => kol.id === id)?.username}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No target</div>
          )}
        </div>
      )}
    </div>
  );
}

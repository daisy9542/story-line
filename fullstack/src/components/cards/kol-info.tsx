"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import { format } from "date-fns";
import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Repeat2,
  ShieldCheck,
  X,
} from "lucide-react";

import { KolTweet, KolTweetRaw } from "@/types/graph";
import { KOL } from "@/types/kol";
import { formatDigital } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function KolInfo() {
  const [sourceKolInfo, setSourceKolInfo] = useState<KOL | null>(null);
  const [targetKolInfo, setTargetKolInfo] = useState<KOL | null>(null);
  const [tweets, setTweets] = useState<KolTweet[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(-1);
  const {
    selectedKol,
    setSelectedKol,
    targetKol,
    selectedTokenSymbol,
    filterTime,
  } = useKolStore();
  const lastSelectedKolIdRef = useRef<string | null>(null);

  const fetchKol = () => {
    if (!selectedKol) return;
    setLoading(true);
    if (targetKol) {
      http
        .get<KOL>("/user", {
          id: targetKol.id,
        })
        .then((data) => {
          setTargetKolInfo(data);
        });
    }
    http
      .get<KOL>("/user", {
        id: selectedKol.id,
      })
      .then((data) => {
        setSourceKolInfo(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTweets = () => {
    if (!selectedKol) return;
    setLoading(true);
    http
      .post<KolTweetRaw>("/tweet", {
        author_id: selectedKol.id,
        label_id: targetKol?.id ?? null,
        token: selectedTokenSymbol,
        page_num: pageNum,
        page_size: 10,
        filter_time: filterTime,
      })
      .then((data) => {
        setTotalPage(data.totalPage);
        setTweets(data.tweets);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!selectedKol) return;
    // 若 selectedKolId 变了，重置页码为 1
    if (selectedKol.id !== lastSelectedKolIdRef.current) {
      lastSelectedKolIdRef.current = selectedKol.id;
      if (pageNum !== 1) {
        setPageNum(1);
        return;
      }
    }
    fetchKol();
    fetchTweets();
  }, [selectedKol, pageNum]);

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

  return (
    <Card className="flex h-full flex-col">
      <Button
        variant="outline"
        onClick={() => setSelectedKol(null)}
        className="absolute right-1 top-1 h-8 w-8 rounded-full"
        aria-label="Close"
      >
        <X />
      </Button>
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-4 py-4">
        {sourceKolInfo && (
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{sourceKolInfo.name}</span>

                <div className="relative h-5 w-5">
                  <VerifiedBadge type={sourceKolInfo.verified_type} />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>@{sourceKolInfo.username}</span>
              </div>
            </div>
            {sourceKolInfo.bio && (
              <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                {sourceKolInfo.bio}
              </p>
            )}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">
                  {formatDigital(sourceKolInfo.friendsCount)}
                </span>{" "}
                <span>Following</span>
              </span>
              <span>
                <span className="font-semibold text-foreground">
                  {formatDigital(sourceKolInfo.followers)}
                </span>{" "}
                <span>Followers</span>
              </span>
            </div>
          </div>
        )}
        <Separator />

        {/* 推文列表区域 */}
        <div className="flex-1 space-y-3 overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div
                key={tweet.tweet_id}
                className="rounded-md border bg-muted p-3"
              >
                <p className="text-sm">{tweet.text}</p>
                <div className="mt-2 flex gap-1 text-xs text-muted-foreground">
                  <span>
                    {format(Number(tweet.created), "yyyy-MM-dd HH:mm")}
                  </span>
                  {tweet.view_count && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-foreground">
                        {formatDigital(tweet.view_count)}
                      </span>{" "}
                      <span>Views</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  {/* 回复 */}
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{formatDigital(tweet.reply_count)}</span>
                  </div>

                  {/* 转推 */}
                  <div className="flex items-center gap-1">
                    <Repeat2 className="h-3 w-3" />
                    <span>{formatDigital(tweet.retweet_count)}</span>
                  </div>

                  {/* 点赞 */}
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{formatDigital(tweet.like_count)}</span>
                  </div>

                  {/* 收藏 */}
                  <div className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    <span>{formatDigital(tweet.bookmarked_count)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No tweets.</p>
          )}
        </div>
      </CardContent>
      {tweets.length > 0 && (
        <CardFooter>
          <div className="flex flex-1 justify-between">
            <Button
              variant="outline"
              disabled={pageNum === 1}
              onClick={() => setPageNum(pageNum - 1)}
              size="sm"
            >
              <ChevronLeft />
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={pageNum === totalPage}
              onClick={() => setPageNum(pageNum + 1)}
              size="sm"
            >
              <ChevronRight />
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

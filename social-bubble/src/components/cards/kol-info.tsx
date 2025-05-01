"use client";

import { useEffect, useRef, useState } from "react";
import { http } from "@/http/client";
import { useKolStore } from "@/stores/kol-store";
import { format } from "date-fns";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Repeat2,
  X,
} from "lucide-react";

import { KolTweet, KolTweetRaw } from "@/types/graph";
import { SimpleKOL } from "@/types/kol";
import { formatDigital } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import KolProfileCard from "@/components/cards/kol-profile-card";

interface KolInfoProps {
  kols: SimpleKOL[];
  kolTargetMap: Record<string, string[]>;
}

export default function KolInfo({ kols, kolTargetMap }: KolInfoProps) {
  const [tweets, setTweets] = useState<KolTweet[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(-1);
  const {
    selectedKol,
    targetKol,
    selectedTokenSymbol,
    filterTime,
    showLess,
    setSelectedKol,
    setTargetKol,
    setTargetHoveredKol,
    setShowLess,
  } = useKolStore();
  const lastSourceKolIdRef = useRef<string | null>(null);
  const lastTargetKolIdRef = useRef<string | null>(null);

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
    if (
      selectedKol.id !== lastSourceKolIdRef.current ||
      (targetKol && targetKol.id !== lastTargetKolIdRef.current)
    ) {
      lastSourceKolIdRef.current = selectedKol.id;
      lastTargetKolIdRef.current = targetKol?.id ?? null;
      if (pageNum !== 1) {
        setPageNum(1);
        return;
      }
    }
    fetchTweets();
  }, [selectedKol, targetKol, pageNum]);

  return (
    <Card className="flex h-full flex-col">
      <div className="absolute right-1 top-1 flex gap-1">
        <Button
          variant="outline"
          onClick={() => setShowLess(!showLess)}
          className="h-8 w-8 rounded-full p-0"
        >
          {!showLess ? <Minus /> : <Plus />}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedKol(null);
            setTargetKol(null);
            setTargetHoveredKol(null);
          }}
          className="h-8 w-8 rounded-full p-0"
          aria-label="Close"
        >
          <X />
        </Button>
      </div>
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-4 py-4">
        {selectedKol && (
          <KolProfileCard
            kol={selectedKol}
            kols={kols}
            kolTargetMap={kolTargetMap}
            isSource={true}
          />
        )}
        {targetKol && (
          <>
            <Separator />
            <KolProfileCard
              kol={targetKol}
              kols={kols}
              kolTargetMap={kolTargetMap}
              isSource={false}
            />
          </>
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
                  {tweet.view_count && tweet.view_count > 0 && (
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

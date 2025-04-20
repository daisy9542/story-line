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
  Repeat2,
} from "lucide-react";

import { KolTweetRaw } from "@/types/graph";
import { SimpleKOL } from "@/types/kol";
import { formatDigital } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function KolInfo() {
  const [user, setUser] = useState<SimpleKOL | null>(null);
  const [tweets, setTweets] = useState<KolTweetRaw[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(-1);
  const { selectedKol } = useKolStore();
  const lastSelectedKolIdRef = useRef<string | null>(null);

  const fetchTweets = () => {
    if (!selectedKol) return;
    setLoading(true);
    http
      .get<KolTweetRaw[]>("/user", {
        authorId: selectedKol.id,
        pageNum: pageNum,
        pageSize: 10,
      })
      .then((data) => {
        if (data.length > 0) {
          setTweets(data);
        } else {
          setUser(null);
          setTweets([]);
        }
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
    fetchTweets();
  }, [selectedKol, pageNum]);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-4 py-4">
        <div className="h-12">
          {selectedKol ? (
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{selectedKol.name}</h2>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  @{selectedKol.username}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDigital(selectedKol.followers)} followers
                </span>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center space-x-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          )}
        </div>

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
                      </span>
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
              disabled={pageNum === totalPages}
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

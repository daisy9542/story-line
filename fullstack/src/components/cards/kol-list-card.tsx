import { useKolStore } from "@/stores/kol-store";

import { SimpleKOL } from "@/types/kol";
import { formatDigital } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserListCardProps {
  kols: SimpleKOL[];
}

export default function UserListCard({ kols }: UserListCardProps) {
  const { setSelectedKol } = useKolStore();

  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-[400px] pr-2 pt-4">
          <div className="cursor-pointer space-y-2">
            {kols.map((kol) => (
              <div
                key={kol.id}
                className={`flex items-center justify-between rounded px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => setSelectedKol(kol)}
              >
                <div className="flex w-0 flex-grow flex-col">
                  <span className="truncate">{kol.name}</span>
                  <span className="text-xs text-muted-foreground">
                    @{kol.username}
                  </span>
                </div>
                <span className="flex w-[60px] justify-end text-sm text-muted-foreground">
                  {formatDigital(kol.followers)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

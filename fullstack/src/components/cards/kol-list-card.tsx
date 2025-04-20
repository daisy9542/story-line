import { useKolStore } from "@/stores/kol-store";

import { SimpleKOL } from "@/types/kol";
import { formatFollowers } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserListCardProps {
  kols: SimpleKOL[];
}

export default function UserListCard({ kols }: UserListCardProps) {
  const { selectedKolId, setSelectedKolId } = useKolStore();

  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-[400px] pr-2">
          <div className="cursor-pointer space-y-2">
            {kols.map((kol) => (
              <div
                key={kol.id}
                className={`flex items-center justify-between rounded px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
                onClick={() => setSelectedKolId(kol.id)}
              >
                <div className="flex flex-col  w-0 flex-grow">
                  <span className="truncate">
                    {kol.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{kol.username}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground w-[60px] flex justify-end">
                  {formatFollowers(kol.followers)}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

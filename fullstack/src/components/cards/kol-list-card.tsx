import { useKolStore } from "@/stores/kol-store";

import { SimpleKOL } from "@/types/kol";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserListCardProps {
  kols: SimpleKOL[];
}

export default function UserListCard({ kols }: UserListCardProps) {
  const { selectedKolId, setSelectedKolId } = useKolStore();

  return (
    <Card>
      {/* <CardHeader> */}
      {/* <CardTitle>User List</CardTitle> */}
      {/* <span>User</span> */}
      {/* </CardHeader> */}
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="cursor-pointer space-y-2">
            {kols.map((kol) => (
              <div
                key={kol.id}
                className="flex items-center justify-between rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setSelectedKolId(kol.id)}
              >
                <span className="font-medium">{kol.username}</span>
                <span className="text-muted-foreground">
                  {kol.followers.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

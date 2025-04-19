import { useKolStore } from "@/stores/kol-store";

import { Card, CardContent } from "@/components/ui/card";

export default function KolInfo() {
  const { selectedKolId } = useKolStore();

  return (
    <>
      {selectedKolId ? (
        <Card>
          <CardContent>
            <div>{selectedKolId}</div>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

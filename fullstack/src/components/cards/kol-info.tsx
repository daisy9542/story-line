import { Card, CardContent } from "@/components/ui/card";

export default function KolInfo({ kolId }: { kolId: string }) {
  return (
    <>
      <Card className="h-full">
        <CardContent>
          <div>{kolId}</div>
        </CardContent>
      </Card>
    </>
  );
}

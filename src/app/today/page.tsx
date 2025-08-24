// /app/today/page.tsx
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function TodayPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Today’s Care Tasks</h1>
      <Card className="p-4">
        <div className="text-lg">🪴 Water Fern in Living Room</div>
        <div className="text-sm text-muted">Due today • Every 3 days</div>
      </Card>
      <Card className="p-4">
        <div className="text-lg">🌿 Fertilize Snake Plant</div>
        <div className="text-sm text-muted">Due today • Monthly</div>
      </Card>
    </div>
  );
}

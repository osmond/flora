import Link from "next/link";
import { Button } from "@/components/ui";

export default function EmptyStateCTA() {
  return (
    <div className="rounded-xl border p-8 text-center bg-muted/30 shadow-sm">
      <p className="mb-4">No tasks yet.</p>
      <Button asChild>
        <Link href="/add">Add your first plant</Link>
      </Button>
    </div>
  );
}

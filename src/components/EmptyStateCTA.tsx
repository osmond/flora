import Link from "next/link";
import { Button } from "@/components/ui";

export default function EmptyStateCTA() {
  return (
    <div className="rounded border p-4 text-center">
      <p className="mb-2">No tasks yet.</p>
      <Button asChild>
        <Link href="/add">Add your first plant</Link>
      </Button>
    </div>
  );
}

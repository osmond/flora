import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EmptyTasksState() {
  return (
    <div className="py-20 text-center space-y-4">
      <p className="text-lg font-medium">You&apos;re all caught up 🎉</p>
      <p className="text-sm text-muted-foreground">
        Add more plants to get new tasks.
      </p>
      <Button asChild className="px-4 py-2 text-sm font-medium">
        <Link href="/plants/new">Add a Plant</Link>
      </Button>
    </div>
  );
}

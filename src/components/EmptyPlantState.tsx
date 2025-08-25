import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EmptyPlantState() {
  return (
    <div className="text-center py-20 space-y-4">
      <p className="text-lg font-medium">No plants yet 🌱</p>
      <p className="text-sm text-muted-foreground">Add your first plant to get started.</p>
      <Button asChild className="px-4 py-2 text-sm font-medium">
        <Link href="/plants/new">Add a Plant</Link>
      </Button>
    </div>
  );
}

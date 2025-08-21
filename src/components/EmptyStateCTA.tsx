import Link from "next/link";

export default function EmptyStateCTA() {
  return (
    <div className="rounded border p-4 text-center">
      <p className="mb-2">No tasks yet.</p>
      <Link href="/add" className="text-green-700 underline">
        Add your first plant
      </Link>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-4 md:p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Flora</h1>
      <p className="mb-4">Your personal plant care companion.</p>
      <Link href="/plants/new" className="text-primary underline">
        Add your first plant
      </Link>
    </main>
  );
}

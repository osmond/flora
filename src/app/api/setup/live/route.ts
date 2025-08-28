import { NextResponse } from "next/server";

// Import existing route handlers to orchestrate
import { POST as seedInitial } from "@/app/api/seed-initial/route";
import { POST as generateCarePlans } from "@/app/api/care-plans/generate/route";
import { POST as generateTasks } from "@/app/api/tasks/generate/route";

async function runStep<T>(fn: (req: Request) => Promise<Response>, label: string) {
  const res = await fn(new Request("http://localhost"));
  let body: any = null;
  try {
    body = await res.json();
  } catch {}
  return { label, status: res.status, ok: res.ok, body };
}

export async function GET() {
  const steps = [] as any[];
  // 1) Seed/migrate plants into rooms
  steps.push(await runStep(seedInitial, "seed-initial"));
  // 2) Generate AI care plans
  steps.push(await runStep(generateCarePlans, "care-plans/generate"));
  // 3) Generate tasks for Today
  steps.push(await runStep(generateTasks, "tasks/generate"));

  const ok = steps.every((s) => s.ok);
  return NextResponse.json({ ok, steps }, { status: ok ? 200 : 207 });
}

export async function POST() {
  return GET();
}

export const runtime = "nodejs";


import { cookies } from "next/headers";

export async function isDemoMode(): Promise<boolean> {
  try {
    const c = await cookies();
    const val = c.get("flora_demo")?.value;
    if (val === "1") return true;
  } catch {}
  return process.env.NEXT_PUBLIC_DEMO_MODE === "1";
}

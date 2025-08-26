import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const to = url.searchParams.get("to") || "test@example.com"
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "")
  // Simulated payload
  const payload = {
    to,
    subject: "Flora — You have tasks due today",
    body: "Open Flora and check your Today list.",
    deepLink: `${base}/today`,
  }
  return NextResponse.json({ ok: true, payload })
}

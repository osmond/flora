import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const to = url.searchParams.get("to") || "test@example.com"
  // Simulated payload
  const payload = {
    to,
    subject: "Flora — You have tasks due today",
    body: "Open Flora and check your Today list.",
    deepLink: "/today"
  }
  return NextResponse.json({ ok: true, payload })
}

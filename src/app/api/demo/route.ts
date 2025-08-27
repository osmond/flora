import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const enabled = Boolean(body?.enabled);
    const res = NextResponse.json({ ok: true, demo: enabled });
    res.cookies.set("flora_demo", enabled ? "1" : "0", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: enabled ? 60 * 60 * 24 * 365 : 0,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}


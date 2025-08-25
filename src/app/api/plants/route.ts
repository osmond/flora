import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

// Create a server client using service role (server-only).
function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const nickname = form.get("name");
    const species = form.get("species") ?? "Unknown";
    const latitude = form.get("latitude");
    if (typeof nickname !== "string" || nickname.trim() === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    let lat: number | null = null;
    if (latitude !== null && latitude !== undefined && latitude !== "") {
      const parsed = Number(latitude);
      if (Number.isNaN(parsed)) {
        return NextResponse.json({ error: "Invalid latitude" }, { status: 400 });
      }
      lat = parsed;
    }
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const payload = { name: nickname, species, latitude: lat, user_id: userId };
    const { data, error } = await supabase.from("plants").insert(payload).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const { data, error } = await supabase.from("plants").select().eq("user_id", userId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

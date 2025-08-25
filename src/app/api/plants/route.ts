import { getCurrentUserId } from "@/lib/auth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { z } from "zod";
import { NextResponse } from "next/server";

const plantSchema = z.object({
  name: z.string().min(1),
  species: z.string().optional(),
  potSize: z.string().optional(),
  potMaterial: z.string().optional(),
  lightLevel: z.string().optional(),
  indoor: z.enum(["Indoor", "Outdoor"]).optional(),
  drainage: z.string().optional(),
  soilType: z.string().optional(),
  humidity: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData.entries());
  const parsed = plantSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  let userId: string;
  try {
    userId = getCurrentUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const plantData = {
    ...parsed.data,
    species: parsed.data.species?.trim() || "Unknown",
  };
  const { error, data: inserted } = await supabaseAdmin
    .from("plants")
    .insert({ ...plantData, user_id: userId })
    .select();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(inserted, { status: 200 });
}

export async function GET() {
  let userId: string;
  try {
    userId = getCurrentUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("plants")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

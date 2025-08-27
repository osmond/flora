import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";

function normalize(s?: string | null) {
  return (s ?? "").trim().toLowerCase();
}

function planFor(name: string) {
  const n = normalize(name);
  const has = (k: string) => n.includes(k);

  // Cacti and succulents
  if (
    [
      "cactus",
      "mammillaria",
      "alo",
      "jade",
      "crassula",
      "opuntia",
      "barrel",
      "torch",
      "neoraimondia",
      "spinystar",
      "zz",
    ].some(has)
  ) {
    return { water: "21 days", fert: "60 days" };
  }

  // Citrus
  if (["lime", "mandarin", "citrus"].some(has)) {
    return { water: "7 days", fert: "45 days" };
  }

  // Herbs/veggies/fruiting
  if (["basil", "lettuce", "strawber", "tobacco"].some(has)) {
    return { water: "2 days", fert: "14 days" };
  }

  // Flowering ornamentals
  if (
    [
      "begonia",
      "azalea",
      "geranium",
      "marigold",
      "snapdragon",
      "zinnia",
      "daisy",
      "hibiscus",
      "lily",
      "rose",
      "poppy",
      "foxglove",
      "periwinkle",
      "lupine",
      "astilbe",
      "blazingstar",
      "clematis",
      "gaillardia",
      "hollyhock",
      "phlox",
      "yarrow",
      "sunflower",
      "delphinium",
      "shasta",
      "bleeding heart",
      "strawflower",
      "venus fly",
    ].some(has)
  ) {
    return { water: "3 days", fert: "21 days" };
  }

  // Large-leaf tropicals
  if (["elephant ears", "fiddle leaf fig", "monstera"].some(has)) {
    return { water: "5 days", fert: "30 days" };
  }

  // Common indoor tropical foliage
  if (
    [
      "pothos",
      "philodendron",
      "peace lily",
      "rubber",
      "croton",
      "pilea",
      "birkin",
      "pink princess",
      "rattlesnake",
      "calathea",
    ].some(has)
  ) {
    return { water: "7 days", fert: "30 days" };
  }

  // Default gentle schedule
  return { water: "10 days", fert: "45 days" };
}

export async function POST() {
  try {
    const supabase = supabaseAdmin();
    const { data: plants, error } = await supabase
      .from("plants")
      .select("id, nickname, species_common, water_every, fert_every");
    if (error) throw error;

    let updated = 0;
    for (const p of plants || []) {
      const name = (p as any).nickname || (p as any).species_common || "";
      const target = planFor(String(name));
      const currentWater = (p as any).water_every ?? null;
      const currentFert = (p as any).fert_every ?? null;
      if (currentWater !== target.water || currentFert !== target.fert) {
        const { error: upErr } = await supabase
          .from("plants")
          .update({ water_every: target.water, fert_every: target.fert })
          .eq("id", (p as any).id);
        if (upErr) throw upErr;
        updated++;
      }
    }

    return NextResponse.json({ ok: true, updated });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


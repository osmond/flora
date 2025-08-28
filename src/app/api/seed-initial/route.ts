import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getDemoPlants } from "@/lib/demoData";

export async function POST() {
  try {
    const supabase = supabaseAdmin();
    // Ensure required rooms exist
    const roomNames = ["Office", "🌸 Outside"] as const;
    const { data: roomRows } = await supabase
      .from("rooms")
      .select("id, name")
      .in("name", roomNames as unknown as string[]);
    const roomMap = new Map<string, number>();
    for (const r of roomRows || []) roomMap.set((r as any).name, (r as any).id);
    for (const name of roomNames) {
      if (!roomMap.has(name)) {
        const { data: created } = await supabase
          .from("rooms")
          .insert({ name })
          .select()
          .single();
        if ((created as any)?.id) roomMap.set(name, (created as any).id as number);
      }
    }
    const officeId = roomMap.get("Office") ?? null;
    const outsideId = roomMap.get("🌸 Outside") ?? null;

    // If plants already exist, skip
    const { data: existingPlants, error: listErr } = await supabase
      .from("plants")
      .select("id, nickname, room_id");
    if (listErr) throw listErr;

    const officeList = [
      "Peruvian Old Man Cactus",
      "Red-Headed Irishman",
      "Golden Barrel Cactus",
      "Pothos",
      "Chinese Money Plant",
      "Christmas Cactus",
      "Bunny Ear Cactus White",
      "Aloe Vera",
      "Lime Tree",
      "Jade Plant",
      "ZZ Plant",
      "Bunny Ear Cactus",
      "Blue Torch Column Cactus",
      "Fiddle Leaf Fig Tree",
      "India Rubber Plant",
      "Coffee big",
      "Croton",
      "Chinese money plant",
      "Coffee Mini",
      "Elephant Ears",
      "Emory's Barrel Cactus",
      "Spinystar",
      "Golden Pothos",
      "Heart of Jesus",
      "Hilo Beauty",
      "Kishu Mandarin",
      "Mammillaria Disco",
      "Mini Kordana Rose",
      "Monstera",
      "Neoraimondia herzogiana",
      "Peace Lily",
      "Persian Shield",
      "Birkin",
      "Pink Princess Philodendron",
      "Rattlesnake Plant",
      "Rex Begonia Prop",
      "Snake Plant",
      "Snake Plant Norma",
      "Tuberous Begonia",
      "ZZ Prop",
      "Maranta Prayer Plant",
      "Burgundy Rubber Tree",
      "Lil Fiddle",
    ];
    const outsideList = [
      "Begonia",
      "Azalea",
      "Hydrangea",
      "Clematis",
      "Gaillardia",
      "Black-eyed Susan",
      "Sunkiss",
      "African Marigold",
      "Geraniums",
      "Gladiolus",
      "Snapdragons",
      "Primrose",
      "Tobacco",
      "Phlox",
      "Yarrow",
      "Zinnia",
      "Sunflower",
      "Hollyhock",
      "Strawberries",
      "Basil",
      "Lettuce",
      "Lotus",
      "Hibiscus",
      "Lily",
      "Venus Fly Trap",
      "Bleeding Heart",
      "Shasta Daisy",
      "Delphinium",
      "Icelandic Poppy",
      "Foxglove",
      "Periwinkle",
      "Wandering Jew",
      "Bee Balm",
      "Astilbe",
      "Lupine",
      "Blazingstar",
      "Strawflower",
    ];

    const officeRows = officeList.map((nickname) => ({
      nickname,
      species_common: nickname,
      species_scientific: nickname,
      room_id: officeId,
      user_id: 'flora-single-user',
    }));
    const outsideRows = outsideList.map((nickname) => ({
      nickname,
      species_common: nickname,
      species_scientific: nickname,
      room_id: outsideId,
      user_id: 'flora-single-user',
    }));
    // Build target map and normalize
    const norm = (s: string) => s.trim().toLowerCase();
    const targetMap = new Map<string, number | null>();
    officeList.forEach((n) => targetMap.set(norm(n), officeId));
    outsideList.forEach((n) => targetMap.set(norm(n), outsideId));

    const existing = existingPlants || [];
    const existingByName = new Map<string, { id: string; room_id: number | null }>();
    for (const p of existing as any[]) {
      existingByName.set(norm((p as any).nickname || ''), { id: (p as any).id, room_id: (p as any).room_id ?? null });
    }

    // Determine updates for existing plants
    let updated = 0;
    for (const [name, targetRoom] of targetMap.entries()) {
      const existingPlant = existingByName.get(name);
      if (existingPlant && targetRoom && existingPlant.room_id !== targetRoom) {
        const { error: upErr } = await supabase
          .from("plants")
          .update({ room_id: targetRoom })
          .eq("id", existingPlant.id);
        if (upErr) throw upErr;
        updated++;
      }
    }

    // Determine missing plants to insert
    const missingOffice = officeList.filter((n) => !existingByName.has(norm(n)));
    const missingOutside = outsideList.filter((n) => !existingByName.has(norm(n)));
    const rows = [
      ...missingOffice.map((nickname) => ({ nickname, species_common: nickname, species_scientific: nickname, room_id: officeId, user_id: 'flora-single-user' })),
      ...missingOutside.map((nickname) => ({ nickname, species_common: nickname, species_scientific: nickname, room_id: outsideId, user_id: 'flora-single-user' })),
    ];
    let inserted = 0;
    if (rows.length) {
      const { data, error } = await supabase.from("plants").insert(rows).select();
      if (error) throw error;
      inserted = data?.length ?? 0;
    }
    return NextResponse.json({ ok: true, inserted, updated });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

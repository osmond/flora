import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expect: { name, species, carePlan: { waterEvery, fertEvery, fertFormula } }
    const { name, species, carePlan } = body ?? {};
    if (!name || !species || !carePlan) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('plants')
      .insert({
        name,
        species,
        water_every: carePlan.waterEvery,
        fert_every: carePlan.fertEvery,
        fert_formula: carePlan.fertFormula,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, plant: data }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}

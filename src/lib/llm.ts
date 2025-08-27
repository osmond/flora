export type CarePlan = {
  water_every: string;
  fert_every: string;
  notes?: string;
};

function seasonFromDate(d = new Date()): "winter" | "spring" | "summer" | "fall" {
  const m = d.getMonth();
  if (m < 2 || m === 11) return "winter";
  if (m < 5) return "spring";
  if (m < 8) return "summer";
  return "fall";
}

export async function generateCarePlan(opts: {
  species?: string | null;
  nickname?: string | null;
  climate: {
    lat?: string;
    lon?: string;
    season?: string;
    avgTempC?: number | null;
    rainChancePct?: number | null;
  };
}): Promise<CarePlan | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const season = opts.climate.season || seasonFromDate();
  const sys = `You are a plant care assistant. Return concise JSON with fields: water_every (string like "7 days"), fert_every (string like "30 days"), and optional notes. Consider species and climate (season=${season}, avgTempC=${opts.climate.avgTempC ?? "n/a"}, rainChancePct=${opts.climate.rainChancePct ?? "n/a"}). Favor practical, conservative intervals suitable for household care. Output ONLY JSON.`;
  const plant = opts.species || opts.nickname || "houseplant";
  const user = `Suggest watering and fertilizing cadence for ${plant}. Return JSON`;
  const body = {
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  } as const;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        ...(process.env.OPENAI_PROJECT
          ? { "OpenAI-Project": process.env.OPENAI_PROJECT as string }
          : {}),
        ...(process.env.OPENAI_ORG
          ? { "OpenAI-Organization": process.env.OPENAI_ORG as string }
          : {}),
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // Surface common issues in development logs
      if (process.env.NODE_ENV !== "production") {
        const txt = await res.text().catch(() => String(res.status));
        // eslint-disable-next-line no-console
        console.error("OpenAI error", res.status, txt);
      }
      return null;
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    const water = String(parsed?.water_every || parsed?.water || "").trim();
    const fert = String(parsed?.fert_every || parsed?.fertilize_every || "").trim();
    const notes = typeof parsed?.notes === "string" ? parsed.notes : undefined;
    if (!water || !fert) return null;
    return { water_every: water, fert_every: fert, notes };
  } catch {
    return null;
  }
}

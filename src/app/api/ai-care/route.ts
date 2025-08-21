import { OPENAI_API_KEY } from "../../../lib/config";

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10_000
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function POST(req: Request) {
  try {
    const {
      latitude,
      longitude,
      species,
      potSize,
      potUnit,
      lightLevel,
      humidity,
    } = (await req.json().catch(() => ({}))) as {
    latitude?: number;
    longitude?: number;
    species?: string;
    potSize?: number;
    potUnit?: "cm" | "in";
    lightLevel?: string;
    humidity?: number;
  };

    const weather: { temperature?: number; humidity?: number } = {};
    let climateZone: string | undefined;

    if (typeof latitude === "number" && typeof longitude === "number") {
      try {
        const weatherRes = await fetchWithTimeout(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m`
        );
        const weatherData = await weatherRes.json();
        weather.temperature = weatherData.current?.temperature_2m;
        weather.humidity = weatherData.current?.relativehumidity_2m;

        const climateRes = await fetchWithTimeout(
          `https://climate-api.open-meteo.com/v1/climate?latitude=${latitude}&longitude=${longitude}&start_date=2020-01-01&end_date=2020-12-31&daily=usda_hardiness_zone`
        );
        const climateData = await climateRes.json();
        const zone = climateData.daily?.usda_hardiness_zone?.[0];
        if (zone !== undefined) climateZone = zone.toString();
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        console.error("Failed to fetch weather or climate zone:", err);
      }
    }

  if (typeof humidity === "number") {
    weather.humidity = humidity;
  }

  let aiData: {
    waterEvery: string;
    waterAmountMl: number;
    fertEvery: string;
    fertFormula: string;
    rationale: string;
  } | null = null;

  let confidence: "low" | "medium" | "high" = "low";

  const infoProvided = [
    species,
    typeof potSize === "number" ? potSize : null,
    lightLevel,
    typeof weather.humidity === "number" ? weather.humidity : null,
    climateZone,
  ].filter((v) => v !== undefined && v !== null);
  if (infoProvided.length >= 4) confidence = "high";
  else if (infoProvided.length >= 2) confidence = "medium";

    if (OPENAI_API_KEY) {
      try {
        const potSizePrompt =
          typeof potSize === "number"
            ? potUnit === "in"
              ? `${(potSize / 2.54).toFixed(1)}in`
              : potUnit === "cm"
              ? `${potSize}cm`
              : `${potSize}`
            : "unknown";
        const prompt = `You are a helpful gardening assistant. Based on the following data, provide watering and fertilizing guidance in JSON format with keys waterEvery, waterAmountMl, fertEvery, fertFormula, and rationale. The rationale must mention the plant species. waterAmountMl must be a number representing the amount of water in milliliters needed each time the plant is watered.

Species: ${species ?? "unknown"}
Pot size: ${potSizePrompt}
Light level: ${lightLevel ?? "unknown"}
Humidity: ${weather.humidity ?? "unknown"}%
Climate zone: ${climateZone ?? "unknown"}
Current temperature: ${weather.temperature ?? "unknown"}°C`;

        const aiRes = await fetchWithTimeout(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.7,
            }),
          }
        );
        const aiJson = await aiRes.json();
        const text = aiJson.choices?.[0]?.message?.content;
        if (text) {
          aiData = JSON.parse(text);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") throw err;
        console.error("Failed to fetch AI recommendations:", err);
      }
    }

  if (!aiData) {
    aiData = {
      waterEvery: "7 days",
      waterAmountMl: 250,
      fertEvery: "Monthly",
      fertFormula: "10-10-10",
      rationale: `General care guidance for ${species ?? "this plant"}.`,
    };
  }

  const extra: string[] = [];
  if (typeof potSize === "number") {
    const displaySize =
      potUnit === "in"
        ? parseFloat((potSize / 2.54).toFixed(1))
        : potSize;
    const unitLabel = potUnit === "in" ? "in" : potUnit === "cm" ? "cm" : "";
    extra.push(`pot size of ${displaySize}${unitLabel}`);
  }
  if (lightLevel) extra.push(`${lightLevel.toLowerCase()} light`);
  if (typeof weather.humidity === "number")
    extra.push(`humidity around ${weather.humidity}%`);
  if (weather.temperature)
    extra.push(`current temperature of ${weather.temperature}°C`);
  if (climateZone) extra.push(`climate zone ${climateZone}`);
  const rationale = `${aiData.rationale} ${extra.join(", ")}.`.trim();

    return Response.json({
      waterEvery: aiData.waterEvery,
      waterAmountMl: aiData.waterAmountMl,
      fertEvery: aiData.fertEvery,
      fertFormula: aiData.fertFormula,
      rationale,
      weather,
      climateZone,
      confidence,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return Response.json(
        { error: "Upstream request timed out" },
        { status: 504 }
      );
    }
    throw err;
  }
}

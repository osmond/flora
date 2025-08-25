import { NextResponse } from "next/server"

type Species = { scientific: string; common?: string }

const DATA: Species[] = [
  { scientific: "Epipremnum aureum", common: "Pothos" },
  { scientific: "Epipremnum aureum 'Neon'", common: "Pothos 'Neon'" },
  { scientific: "Monstera deliciosa", common: "Monstera" },
  { scientific: "Sansevieria trifasciata", common: "Snake Plant" },
  { scientific: "Ficus lyrata", common: "Fiddle-leaf fig" },
  { scientific: "Spathiphyllum wallisii", common: "Peace Lily" },
  { scientific: "Chlorophytum comosum", common: "Spider Plant" },
]

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  const results = !q
    ? []
    : DATA.filter(s =>
        s.scientific.toLowerCase().includes(q) ||
        (s.common && s.common.toLowerCase().includes(q))
      ).slice(0, 10)
  return NextResponse.json({ results })
}

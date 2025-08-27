export type PlantRow = {
  id: string;
  nickname: string;
  species?: string | null;
  water_every?: string | null;
  fert_every?: string | null;
  last_watered_at?: string | null;
  last_fertilized_at?: string | null;
};

export const fallbackPlants: PlantRow[] = [
  {
    id: "1",
    nickname: "Monstera",
    species: "Deliciosa",
    water_every: "7 days",
    last_watered_at: new Date(Date.now() - 8 * 86_400_000).toISOString(),
  },
  {
    id: "2",
    nickname: "Fiddle Leaf Fig",
    species: "Ficus lyrata",
    fert_every: "30 days",
    last_fertilized_at: new Date(
      Date.now() - 30 * 86_400_000
    ).toISOString(),
  },
  {
    id: "3",
    nickname: "Snake Plant",
    species: "Dracaena trifasciata",
    water_every: "14 days",
    last_watered_at: new Date(
      Date.now() - 10 * 86_400_000
    ).toISOString(),
  },
];

export function getFallbackPlant(id: string): PlantRow | null {
  return fallbackPlants.find((p) => p.id === id) ?? null;
}

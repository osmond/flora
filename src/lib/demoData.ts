import { formatISO } from "date-fns";
import type { CareEvent } from "@/types";
import type { PlantRow } from "@/lib/fallbackPlants";

export const DEMO_PLANTS: PlantRow[] = [
  { id: "1", nickname: "Monstera", species: "Deliciosa", water_every: "7 days", last_watered_at: new Date(Date.now() - 8*86400000).toISOString() },
  { id: "2", nickname: "Fiddle Leaf Fig", species: "Ficus lyrata", fert_every: "30 days", last_fertilized_at: new Date(Date.now() - 30*86400000).toISOString() },
  { id: "3", nickname: "Snake Plant", species: "Dracaena trifasciata", water_every: "14 days", last_watered_at: new Date(Date.now() - 10*86400000).toISOString() },
  { id: "4", nickname: "Pothos", species: "Epipremnum aureum", water_every: "10 days", last_watered_at: new Date(Date.now() - 9*86400000).toISOString() },
  { id: "5", nickname: "ZZ Plant", species: "Zamioculcas zamiifolia", water_every: "21 days", last_watered_at: new Date(Date.now() - 15*86400000).toISOString() },
  { id: "6", nickname: "Spider Plant", species: "Chlorophytum comosum", water_every: "7 days", last_watered_at: new Date(Date.now() - 6*86400000).toISOString() },
  { id: "7", nickname: "Peace Lily", species: "Spathiphyllum", water_every: "5 days", last_watered_at: new Date(Date.now() - 4*86400000).toISOString() },
  { id: "8", nickname: "Rubber Plant", species: "Ficus elastica", fert_every: "45 days", last_fertilized_at: new Date(Date.now() - 20*86400000).toISOString() },
  { id: "9", nickname: "Bird of Paradise", species: "Strelitzia", water_every: "9 days", last_watered_at: new Date(Date.now() - 7*86400000).toISOString() },
  { id: "10", nickname: "Calathea", species: "Calathea ornata", water_every: "6 days", last_watered_at: new Date(Date.now() - 5*86400000).toISOString() },
  { id: "11", nickname: "Parlor Palm", species: "Chamaedorea elegans", water_every: "12 days", last_watered_at: new Date(Date.now() - 11*86400000).toISOString() },
  { id: "12", nickname: "Aloe Vera", species: "Aloe barbadensis", water_every: "21 days", last_watered_at: new Date(Date.now() - 14*86400000).toISOString() },
  { id: "13", nickname: "Jade Plant", species: "Crassula ovata", water_every: "18 days", last_watered_at: new Date(Date.now() - 13*86400000).toISOString() },
  { id: "14", nickname: "Philodendron", species: "Philodendron hederaceum", water_every: "8 days", last_watered_at: new Date(Date.now() - 7*86400000).toISOString() },
  { id: "15", nickname: "Chinese Evergreen", species: "Aglaonema", water_every: "10 days", last_watered_at: new Date(Date.now() - 9*86400000).toISOString() },
  { id: "16", nickname: "Dieffenbachia", species: "Dieffenbachia seguine", water_every: "9 days", last_watered_at: new Date(Date.now() - 8*86400000).toISOString() },
  { id: "17", nickname: "Dracaena", species: "Dracaena fragrans", water_every: "13 days", last_watered_at: new Date(Date.now() - 12*86400000).toISOString() },
  { id: "18", nickname: "Schefflera", species: "Schefflera arboricola", water_every: "11 days", last_watered_at: new Date(Date.now() - 10*86400000).toISOString() },
  { id: "19", nickname: "Pilea", species: "Pilea peperomioides", water_every: "7 days", last_watered_at: new Date(Date.now() - 6*86400000).toISOString() },
  { id: "20", nickname: "Boston Fern", species: "Nephrolepis exaltata", water_every: "5 days", last_watered_at: new Date(Date.now() - 4*86400000).toISOString() },
  { id: "21", nickname: "Bromeliad", species: "Guzmania", water_every: "9 days", last_watered_at: new Date(Date.now() - 7*86400000).toISOString() },
  { id: "22", nickname: "English Ivy", species: "Hedera helix", water_every: "6 days", last_watered_at: new Date(Date.now() - 5*86400000).toISOString() },
  { id: "23", nickname: "African Violet", species: "Saintpaulia", water_every: "7 days", last_watered_at: new Date(Date.now() - 6*86400000).toISOString() },
];

export function getDemoPlants(): PlantRow[] {
  return DEMO_PLANTS;
}

export type DemoEvent = {
  id: string;
  plant_id: string;
  type: "water" | "fertilize" | "note";
  note: string | null;
  image_url: string | null;
  created_at: string; // ISO
};

export function buildDemoEvents(seed = 1, plants: PlantRow[] = DEMO_PLANTS): DemoEvent[] {
  const rng = mulberry32(seed);
  const now = Date.now();
  const days = 14;
  const events: DemoEvent[] = [];
  for (const p of plants) {
    for (let i = 0; i < days; i++) {
      if (rng() < 0.25) {
        const created = new Date(now - i * 86400000 - Math.floor(rng() * 8) * 3600000);
        events.push({
          id: `${p.id}-w-${i}`,
          plant_id: p.id,
          type: "water",
          note: null,
          image_url: null,
          created_at: formatISO(created),
        });
      }
      if (rng() < 0.08) {
        const created = new Date(now - i * 86400000 - Math.floor(rng() * 8) * 3600000);
        events.push({
          id: `${p.id}-f-${i}`,
          plant_id: p.id,
          type: "fertilize",
          note: null,
          image_url: null,
          created_at: formatISO(created),
        });
      }
    }
  }
  // Ensure each plant has at least one recent event
  for (const p of plants) {
    if (!events.some((e) => e.plant_id === p.id)) {
      events.push({
        id: `${p.id}-seed`,
        plant_id: p.id,
        type: "water",
        note: null,
        image_url: null,
        created_at: formatISO(new Date(now - 2 * 86400000)),
      });
    }
  }
  return events.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function toCareEvents(events: DemoEvent[]): CareEvent[] {
  return events.map((e) => ({
    id: e.id,
    type: e.type,
    note: e.note,
    image_url: e.image_url,
    created_at: e.created_at,
  }));
}

// Small deterministic RNG for repeatable demo
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


import type { CareEventType } from "@/types";

export type Event = {
  id: string;
  plant_id: string;
  type: CareEventType;
  note: string | null;
  image_url: string | null;
  public_id: string | null;
  created_at: string;
};

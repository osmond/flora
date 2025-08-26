// Supported care event types logged for a plant.
export const CARE_EVENT_TYPES = [
  "water",
  "fertilize",
  "note",
  "photo",
] as const;

export type CareEventType = (typeof CARE_EVENT_TYPES)[number];

// Additional entries used when hydrating the timeline with upcoming due items.
export type CareEventTimelineType =
  | CareEventType
  | `${CareEventType} due`;

export interface CareEvent {
  id: string;
  type: CareEventTimelineType;
  note: string | null;
  image_url: string | null;
  created_at: string;
  tag?: CareEventType | null;
}

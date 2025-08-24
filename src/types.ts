export interface CareEvent {
  id: string;
  type: string;
  note: string | null;
  image_url: string | null;
  created_at: string;
}

export type Task = {
  id: string;
  plantId: string;
  plantName: string;
  type: 'water' | 'fertilize' | 'note';
  due: string; // ISO date string
};

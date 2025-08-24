export type Task = {
  id: string;
  plantName: string;
  type: 'water' | 'fertilize' | 'note';
  due: string; // ISO date string
};

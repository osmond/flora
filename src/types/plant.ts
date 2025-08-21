export type Plant = {
  name: string;
  species: string;
  common_name?: string;
  image_url?: string;
  pot: string;
  potMaterial: string;
  light: string;
  indoor: 'Indoor' | 'Outdoor';
  drainage: string;
  soil: string;
  humidity: string;
};

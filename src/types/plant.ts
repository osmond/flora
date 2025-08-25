export type Plant = {
  nickname: string;
  speciesScientific: string;
  speciesCommon?: string;
  potSize: string;
  potMaterial: string;
  lightLevel: string;
  indoor: 'Indoor' | 'Outdoor';
  drainage: string;
  soilType: string;
  humidity: string;
  latitude: string;
  longitude: string;
};

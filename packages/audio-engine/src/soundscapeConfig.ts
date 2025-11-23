import { Soundscape } from './audioTypes';

export const SLU_SOUNDscape: Soundscape = {
  id: 'slu',
  name: 'South Lake Union',
  baseLayers: [
    { id: 'wind1', name: 'Wind' },
    { id: 'water', name: 'Water' },
    { id: 'hum', name: 'City Hum' },
  ],
  events: [
    {
      id: 'footsteps',
      name: 'Footsteps',
      weight: 0.3,
      minDelay: 5000,
      maxDelay: 15000,
    },
    {
      id: 'bikes',
      name: 'Bikes',
      weight: 0.25,
      minDelay: 8000,
      maxDelay: 20000,
    },
    {
      id: 'seaplanes',
      name: 'Seaplanes',
      weight: 0.15,
      minDelay: 20000,
      maxDelay: 45000,
    },
  ],
};

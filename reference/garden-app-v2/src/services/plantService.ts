export interface PlantSpecies {
  id: string;
  commonName: string;
  botanicalName: string;
  category: 'Vegetable' | 'Herb' | 'Houseplant';
  thumbnail: string;
  baseDTM: number; // Days to Maturity
}

export const PLANT_DATABASE: PlantSpecies[] = [
  { 
    id: 'roma-tomato', 
    commonName: 'Roma Tomato', 
    botanicalName: 'Solanum lycopersicum', 
    category: 'Vegetable', 
    thumbnail: 'https://images.unsplash.com/photo-1592841200221-a6898f307bac?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 75 
  },
  { 
    id: 'cherry-tomato', 
    commonName: 'Cherry Tomato', 
    botanicalName: 'Solanum lycopersicum var. cerasiforme', 
    category: 'Vegetable', 
    thumbnail: 'https://images.unsplash.com/photo-1561131245-c9305e43ad9d?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 65 
  },
  { 
    id: 'genovese-basil', 
    commonName: 'Genovese Basil', 
    botanicalName: 'Ocimum basilicum', 
    category: 'Herb', 
    thumbnail: 'https://images.unsplash.com/photo-1618375531912-77ac314bb44c?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 60 
  },
  { 
    id: 'monstera', 
    commonName: 'Monstera Deliciosa', 
    botanicalName: 'Monstera deliciosa', 
    category: 'Houseplant', 
    thumbnail: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 365 
  },
  { 
    id: 'lavender', 
    commonName: 'Lavender', 
    botanicalName: 'Lavandula angustifolia', 
    category: 'Herb', 
    thumbnail: 'https://images.unsplash.com/photo-1528650353112-a89e02390886?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 90 
  },
  { 
    id: 'kale', 
    commonName: 'Red Russian Kale', 
    botanicalName: 'Brassica oleracea', 
    category: 'Vegetable', 
    thumbnail: 'https://images.unsplash.com/photo-1524179524672-4509743c6c97?q=80&w=100&h=100&auto=format&fit=crop',
    baseDTM: 55 
  }
];

export type GrowthStage = 'Seed' | 'Seedling' | 'Mature';
export type CultivationMethod = 'Soil' | 'Container' | 'Hydroponic';

export interface PlantOnboardingConfig {
  speciesId: string;
  stage: GrowthStage;
  locationId: string;
  plantedDate: Date;
  method: CultivationMethod;
}

export function calculateEHD(config: PlantOnboardingConfig, species: PlantSpecies): Date {
  let daysRemaining = species.baseDTM;

  // Modifier 1: Growth Stage at Input
  if (config.stage === 'Seed') {
    daysRemaining += 10; // Add germination window
  } else if (config.stage === 'Mature') {
    daysRemaining = 20; // Fallback for mature plants (harvest window)
  }
  // Seedling uses base DTM (+0 offsets)

  // Modifier 2: Cultivation Method
  if (config.method === 'Hydroponic') {
    daysRemaining *= 0.75; // 25% faster
  } else if (config.method === 'Container') {
    daysRemaining *= 1.05; // Slightly slower due to confined roots
  }
  // In-Ground is 1.00x

  // Modifier 3: Environmental Drag (Live Weather Sync Simulation)
  // The engine adds +1.2 days for every "stress day". 
  // We'll simulate 5 stress days for the initial calculation.
  const environmentalDrag = 5 * 1.2;
  daysRemaining += environmentalDrag;

  const ehd = new Date(config.plantedDate);
  ehd.setDate(ehd.getDate() + Math.round(daysRemaining));
  return ehd;
}

export interface SensorData {
  vitality: number;
  ambient: {
    temp: number;
    humidity: number;
    status: string;
  };
  soil: {
    moisture: number;
    ph: number;
    nutrients: string;
    temp: number;
  };
  light: {
    lux: string;
    intensity: string;
    peakHoursReached: boolean;
  };
  weatherAlerts: WeatherAlert[];
  actions: GardenAction[];
}

export interface WeatherAlert {
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  message: string;
}

export interface GardenAction {
  id: number;
  type: string;
  plant: string;
  location: string;
  message: string;
}

export interface IdentityResult {
  commonName: string;
  scientificName: string;
  description: string;
  careSummary: string;
}

export interface DiagnosisResult {
  diagnosis: string;
  severity: string;
  confidence: number;
  treatmentPlan: string[];
  symptoms: string;
}

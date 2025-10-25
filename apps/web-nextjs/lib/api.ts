// API service to connect to Next.js API routes

export interface SearchSubstitutionArgs {
  ingredient: string;
  quantity?: number;
  unit?: string;
  dish?: string;
  lat?: number;
  lon?: number;
  radius_m?: number;
}

export interface EffectsResult {
  summary: string;
  supported: boolean;
}

// V2: Re-enable when implementing store lookup
// export interface Store {
//   name: string;
//   lat: number;
//   lon: number;
//   distance_m: number;
// }

export interface ConsolidatedResult {
  supported: boolean;
  base?: string;
  substitute?: string;
  quantity?: number;
  unit?: string;
  basis?: 'volume' | 'unit';
  notes?: string;
  alternatives?: Array<{ substitute: string; ratioMultiplier?: number }>;
  effects?: EffectsResult;
  // stores?: Store[]; // V2: Re-enable when implementing store lookup
  message?: string;
  examples?: string[];
}

export const api = {
  searchSubstitute: async (args: SearchSubstitutionArgs): Promise<ConsolidatedResult> => {
    const response = await fetch('/api/substitute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      throw new Error('Failed to search substitutions');
    }

    return response.json();
  },
};

export interface DogBreed {
  name: string;
  origin: string;
  temperament: string;
  lifeSpan: string;
  description: string;
  imageUrl: string;
}

export interface SearchResult {
  title: string;
  text: string;
  source: string;
  confidence: number;
  imageUrl?: string;
}

export interface LanguageDetection {
  language: string;
  confidence: number;
}

export class DogApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DogApiError';
  }
}

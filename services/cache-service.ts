import { CONFIG, ERRORS } from '@/constants/api-constants';
import { DogApiError } from '@/types/breed';

interface CacheData<T> {
  timestamp: number;
  data: T;
}

export class CacheService {
  private cacheKey: string;

  constructor(private storageKey: string) {
    this.cacheKey = `dog_api_${storageKey}`;
  }

  async get<T>(): Promise<T | null> {
    try {
      if (typeof window === 'undefined') return null; // Проверка на SSR

      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;

      const cache: CacheData<T> = JSON.parse(cached);
      
      // Проверяем актуальность кеша
      if (Date.now() - cache.timestamp < CONFIG.CACHE_DURATION) {
        return cache.data;
      }

      // Если кеш устарел, удаляем его
      localStorage.removeItem(this.cacheKey);
      return null;
    } catch (error) {
      // Если произошла ошибка при чтении кеша, возвращаем null
      return null;
    }
  }

  async set<T>(data: T): Promise<void> {
    try {
      if (typeof window === 'undefined') return; // Проверка на SSR

      const cache: CacheData<T> = {
        timestamp: Date.now(),
        data
      };
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    } catch (error) {
      throw new DogApiError(
        'Failed to write cache',
        ERRORS.CACHE_ERROR,
        { originalError: error }
      );
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined') return; // Проверка на SSR

      localStorage.removeItem(this.cacheKey);
    } catch (error) {
      throw new DogApiError(
        'Failed to clear cache',
        ERRORS.CACHE_ERROR,
        { originalError: error }
      );
    }
  }
}

import { DogBreed, SearchResult, DogApiError } from '@/types/breed';
import { CONFIG, ERRORS } from '@/constants/api-constants';
import { normalizeSearchQuery, fuzzyMatch } from '@/utils/string-utils';
import { CacheService } from '@/services/cache-service';
import { LanguageDetector } from '@/services/language-detector';

const cacheService = new CacheService(CONFIG.CACHE_FILE_PATH);
const languageDetector = new LanguageDetector();

/**
 * Получает информацию о всех породах собак
 * Сначала пытается получить из кеша, если нет - делает запрос к API
 */
export async function getAllBreeds(): Promise<DogBreed[]> {
  try {
    // Пробуем получить данные из кеша
    const cachedData = await cacheService.get<DogBreed[]>();
    if (cachedData) {
      return cachedData;
    }

    // Если кеш пуст или устарел, делаем запрос к API
    const response = await fetch(`${CONFIG.API_BASE_URL}/breeds`);
    if (!response.ok) {
      throw new DogApiError(
        'Failed to fetch breeds',
        ERRORS.FETCH_ERROR,
        { status: response.status }
      );
    }

    const breeds = await response.json();
    const enrichedBreeds = breeds.map((breed: any) => ({
      name: breed.name,
      origin: breed.origin || 'Unknown',
      temperament: breed.temperament || 'Information not available',
      lifeSpan: breed.life_span || 'Information not available',
      description: breed.description || '',
      imageUrl: breed.image?.url || ''
    }));

    // Сохраняем в кеш
    await cacheService.set(enrichedBreeds);

    return enrichedBreeds;
  } catch (error) {
    if (error instanceof DogApiError) {
      throw error;
    }
    throw new DogApiError(
      'Failed to process breeds data',
      ERRORS.PARSE_ERROR,
      { originalError: error }
    );
  }
}

/**
 * Поиск породы по названию с поддержкой нечеткого поиска
 */
export async function searchBreed(query: string): Promise<SearchResult[]> {
  try {
    const breeds = await getAllBreeds();
    const normalizedQuery = normalizeSearchQuery(query);
    
    // Определяем язык запроса
    const queryLanguage = await languageDetector.detect(query);

    return breeds
      .map(breed => {
        const confidence = fuzzyMatch(breed.name, normalizedQuery);
        return {
          title: breed.name,
          text: breed.description || breed.temperament,
          source: 'The Dog API',
          confidence,
          imageUrl: breed.imageUrl
        };
      })
      .filter(result => result.confidence >= CONFIG.SEARCH_THRESHOLD)
      .sort((a, b) => b.confidence - a.confidence);
  } catch (error) {
    throw new DogApiError(
      'Search failed',
      ERRORS.SEARCH_ERROR,
      { originalError: error }
    );
  }
}

/**
 * Получает случайную породу
 */
export async function getRandomBreed(): Promise<DogBreed> {
  try {
    const breeds = await getAllBreeds();
    const randomIndex = Math.floor(Math.random() * breeds.length);
    return breeds[randomIndex];
  } catch (error) {
    throw new DogApiError(
      'Failed to get random breed',
      ERRORS.API_ERROR,
      { originalError: error }
    );
  }
}

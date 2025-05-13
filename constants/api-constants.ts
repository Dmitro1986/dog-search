export const CONFIG = {
  API_BASE_URL: 'https://api.thedogapi.com/v1',
  CACHE_FILE_PATH: 'breeds_cache',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  DEBOUNCE_DELAY: 300,
  SEARCH_THRESHOLD: 0.8,
  API_DELAYS: {
    RANDOM_BREED: 500,
    CHATGPT: 1500,
    WIKIPEDIA: 1200
  },
  LANGUAGES: {
    EN: 'en',
    RU: 'ru',
    UK: 'uk'
  }
} as const;

export const ERRORS = {
  FETCH_ERROR: 'FETCH_ERROR',
  CACHE_ERROR: 'CACHE_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  INVALID_BREED: 'INVALID_BREED',
  NOT_FOUND: 'NOT_FOUND',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SEARCH_ERROR: 'SEARCH_ERROR'
} as const;

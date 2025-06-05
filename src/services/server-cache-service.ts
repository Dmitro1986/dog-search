/** @format */
import fs from 'fs';
import path from 'path';

// Путь к файлу кеша
const CACHE_FILE = path.join(process.cwd(), 'data', 'dog_breeds_cache.json');

// Кеш в памяти для быстрого доступа
let serverCache: Map<string, any> | null = null;

// Загрузка данных из файла кеша
export function loadCacheFromFile() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cacheData = JSON.parse(data);
      
      // Инициализируем кеш в памяти
      serverCache = new Map();
      
      if (cacheData && cacheData.breeds) {
        // Сохраняем породы в кеше по имени для быстрого доступа
        cacheData.breeds.forEach((breed: any) => {
          if (breed.name) {
            serverCache!.set(`breed:${breed.name.toLowerCase()}`, {
              title: breed.name,
              text: breed.description || `${breed.name} - порода собак.`,
              temperament: breed.temperament || "",
              lifeSpan: breed.life_span || "",
              image: breed.image_url || null,
              url: breed.wikipedia_url || null,
            });
          }
        });
        console.log(`Загружено ${cacheData.breeds.length} пород из файла кеша`);
      }
      
      return cacheData;
    }
  } catch (error) {
    console.error('Ошибка загрузки кеша из файла:', error);
  }
  return null;
}

// Получение данных из кеша
export function searchBreedCache(query: string) {
  // Если кеш еще не загружен, загружаем его
  if (!serverCache) {
    loadCacheFromFile();
  }
  
  // Если кеш все еще не загружен (ошибка), возвращаем null
  if (!serverCache) {
    return null;
  }
  
  const key = `breed:${query.toLowerCase()}`;
  return serverCache.get(key);
}

// Получение всех пород из кеша
export function getAllBreeds() {
  // Если кеш еще не загружен, загружаем его
  if (!serverCache) {
    const cacheData = loadCacheFromFile();
    return cacheData?.breeds || [];
  }
  
  // Если кеш загружен, возвращаем все породы
  const breeds: any[] = [];
  serverCache.forEach((value, key) => {
    if (key.startsWith('breed:')) {
      breeds.push(value);
    }
  });
  
  return breeds;
}
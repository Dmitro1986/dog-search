/** @format */

// Кеш в памяти для клиента
let clientCache: Map<string, any> | null = null;

// Загрузка данных из API
export async function loadCacheFromAPI() {
  try {
    const response = await fetch('/api/load-cache');
    if (!response.ok) {
      throw new Error('Ошибка загрузки кеша');
    }
    
    const cacheData = await response.json();
    
    // Инициализируем кеш в памяти
    clientCache = new Map();
    
    if (cacheData && cacheData.breeds) {
      // Сохраняем породы в кеше по имени для быстрого доступа
      cacheData.breeds.forEach((breed: any) => {
        if (breed.name) {
          clientCache!.set(`breed:${breed.name.toLowerCase()}`, {
            title: breed.name,
            text: breed.description || `${breed.name} - порода собак.`,
            temperament: breed.temperament || "",
            lifeSpan: breed.life_span || "",
            image: breed.image_url || null,
            url: breed.wikipedia_url || null,
          });
        }
      });
      console.log(`Загружено ${cacheData.breeds.length} пород из API`);
    }
    
    return cacheData;
  } catch (error) {
    console.error('Ошибка загрузки кеша из API:', error);
    return null;
  }
}

// Получение данных из кеша
export function searchBreedCache(query: string) {
  // Если кеш не загружен, возвращаем null
  if (!clientCache) {
    return null;
  }
  
  const key = `breed:${query.toLowerCase()}`;
  return clientCache.get(key);
}

// Получение всех пород из кеша
export function getAllBreeds() {
  // Если кеш не загружен, возвращаем пустой массив
  if (!clientCache) {
    return [];
  }
  
  // Если кеш загружен, возвращаем все породы
  const breeds: any[] = [];
  clientCache.forEach((value, key) => {
    if (key.startsWith('breed:')) {
      breeds.push(value);
    }
  });
  
  return breeds;
}
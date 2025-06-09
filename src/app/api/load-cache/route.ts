/** @format */
import fs from 'fs';
import path from 'path';

// Путь к файлу кеша
const CACHE_FILE = path.join(process.cwd(), 'data', 'dog_breeds_cache.json');

// Кеш в памяти для быстрого доступа на сервере
let serverCache: any = null;

export async function GET() {
  try {
    // Если кеш уже загружен, возвращаем его
    if (serverCache) {
      return Response.json(serverCache);
    }

    // Загружаем кеш из файла
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      const cacheData = JSON.parse(data);
      
      // Сохраняем кеш в памяти сервера
      serverCache = cacheData;
      
      console.log(`Загружено ${cacheData.breeds?.length || 0} пород из файла кеша`);
      
      return Response.json(cacheData);
    }
    
    return Response.json({ error: "Кеш не найден" }, { status: 404 });
  } catch (error) {
    console.error('Ошибка загрузки кеша из файла:', error);
    return Response.json({ error: "Ошибка загрузки кеша" }, { status: 500 });
  }
}
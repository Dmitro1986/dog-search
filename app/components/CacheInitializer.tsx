'use client';

import { useEffect, useState } from 'react';
import { loadCacheFromAPI } from '@/services/client-cache-service';

export default function CacheInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Загружаем кеш при монтировании компонента
    async function initCache() {
      await loadCacheFromAPI();
      setInitialized(true);
    }
    
    initCache();
  }, []);

  return null; // Этот компонент не рендерит ничего видимого
}
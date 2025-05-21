/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EnrichedBreed } from "@/types";
import { searchBreedCache } from "@/services/client-cache-service";
// Удалить строку с импортом fetch-wikipedia-data

interface BreedDirectoryProps {
  onSelect: (name: string, lang?: string) => void;
  lang?: string;
}

export function BreedDirectory({ onSelect, lang }: BreedDirectoryProps & { lang?: string }) {
  const [breeds, setBreeds] = useState<EnrichedBreed[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = document.querySelector('[role="menu"]');
    if (container) {
      container.setAttribute('aria-activedescendant', 'breed-0');
    }
  }, [breeds]);

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/breeds?lang=${lang || 'en'}`);
        const data = await res.json();
        console.log("📥 Породы из /api/breeds:", data);
        // Фильтруем только те объекты, у которых есть имя
        const validBreeds = Array.isArray(data)
          ? data.filter((b: EnrichedBreed) => b && typeof b.name === "string")
          : [];
        setBreeds(validBreeds);
      } catch (err) {
        console.error("Ошибка загрузки пород:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBreeds(); // ← Добавляем вызов функции
  }, [lang]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2"> пород</h4>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start text-left text-sm"
              disabled
            >
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">

      <h4 className="text-sm font-semibold mb-2"> Породы</h4>
       <div className="max-h-64 overflow-y-auto space-y-1" role="menu">
        {breeds.map((breed, index) => (
          <Button
            key={breed.id}
            id={`breed-${index}`}
            variant="ghost"
            className="w-full justify-start text-left text-sm focus:bg-accent"
            role="menuitem"
            tabIndex={0}
            onClick={async () => {
              if (breed.name) {
                // Сначала проверяем кеш
                const cached = await searchBreedCache(breed.name);
                if (cached) {
                  onSelect(breed.name, 'cache');
                  return;
                }
                
                // Затем проверяем Википедию через API
                try {
                  const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: breed.name, lang })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    if (data?.result?.text) {
                      onSelect(breed.name, 'wikipedia');
                      return;
                    }
                  }
                } catch (wikiError) {
                  console.error('Ошибка запроса к Википедии:', wikiError);
                }

                // Только если нет данных - запрос к GPT
                onSelect(breed.name, 'chatgpt');
              }
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && breed.name) {
                // Trigger breed selection logic
                (e.currentTarget as HTMLElement).click();
              }
            }}
          >
            {breed.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

/** @format */

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EnrichedBreed } from "@/types";

interface BreedDirectoryProps {
  onSelect: (name: string) => void;
}

export function BreedDirectory({ onSelect }: BreedDirectoryProps) {
  const [breeds, setBreeds] = useState<EnrichedBreed[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/breeds");
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

    fetchBreeds();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-2">Каталог пород</h4>
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
      <h4 className="text-sm font-semibold mb-2">Каталог пород</h4>
      <div className="max-h-64 overflow-y-auto space-y-1">
        {breeds.map((breed) => (
          <Button
            key={breed.id}
            variant="ghost"
            className="w-full justify-start text-left text-sm"
            onClick={() => {
              if (breed.name) {
                onSelect(breed.name);
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

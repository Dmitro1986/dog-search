/** @format */

// app/api/breeds/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { EnrichedBreed } from "@/types";


// Конфигурация кеширования
const CACHE_FILE = path.join(process.cwd(), "data", "dog_breeds_cache.json");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 часа
const DOG_API_URL = "https://api.thedogapi.com/v1";

// Типы данных
interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  origin?: string;
  weight?: { metric: string };
  height?: { metric: string };
  bred_for?: string;
  breed_group?: string;
  reference_image_id?: string;
  wikipedia_url?: string;
  description?: string;
}

interface CacheData {
  timestamp: number;
  dataHash: string;
  breeds: EnrichedBreed[];
}

// Генерация хеша данных
function generateDataHash(breeds: Breed[]): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(breeds))
    .digest("hex");
}

async function fetchAllBreeds(): Promise<Breed[]> {
  const res = await fetch(`${DOG_API_URL}/breeds`, {
    headers: {
      "x-api-key": process.env.DOG_API_KEY || "",
    },
  });

  if (!res.ok) throw new Error(`Dog API error: ${res.status}`);
  return await res.json();
}

async function enrichBreed(breed: Breed): Promise<EnrichedBreed> {
  const imageUrl = breed.reference_image_id
    ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
    : "/placeholder.svg";


  return {
    id: breed.id,
    name: breed.name,
    description:
      breed.description || breed.temperament || "No description available",
    temperament: breed.temperament || "Not specified",
    life_span: breed.life_span || "Unknown",
    origin: breed.origin || "Unknown",
    weight: breed.weight?.metric || "Unknown",
    height: breed.height?.metric || "Unknown",
    bred_for: breed.bred_for || "Not specified",
    breed_group: breed.breed_group || "Not specified",
    image_url: imageUrl,
    wikipedia_url: breed.wikipedia_url || "",
  };
}

async function fetchAndCacheBreeds(
  cache: CacheData | null
): Promise<EnrichedBreed[]> {
  try {
    console.log("Fetching breeds from Dog API...");
    const breedsData = await fetchAllBreeds();
    const currentHash = generateDataHash(breedsData);

    if (cache?.dataHash === currentHash) {
      console.log("Data not changed in Dog API");
      return cache.breeds;
    }

    console.log("Data changed, updating cache...");
    const enrichedBreeds = await Promise.all(breedsData.map(enrichBreed));

    const newCache: CacheData = {
      timestamp: Date.now(),
      dataHash: currentHash,
      breeds: enrichedBreeds.filter((b) => b.image_url && b.name),
    };

    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(newCache, null, 2));

    return newCache.breeds;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

async function readCache(): Promise<CacheData | null> {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const cache = await readCache();
    const now = Date.now();

    if (cache && now - cache.timestamp < CACHE_TTL_MS) {
      console.log("Returning cached data");
      return NextResponse.json(cache.breeds);
    }

    const breeds = await fetchAndCacheBreeds(cache);
    return NextResponse.json(breeds);
  } catch (err) {
    const cache = await readCache();
    if (cache?.breeds) {
      console.error("Using stale cache due to error:", err);
      return NextResponse.json(cache.breeds);
    }

    return NextResponse.json(
      { error: "Failed to fetch breeds" },
      { status: 500 }
    );
  }
}

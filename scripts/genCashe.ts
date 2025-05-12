/** @format */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });// для локальной отладки

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DOG_API_URL = "https://api.thedogapi.com/v1";
const CACHE_FILE = path.join(process.cwd(), "data", "dog_breeds_cache.json");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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

interface EnrichedBreed extends Breed {
  image_url: string;
}

interface CacheData {
  timestamp: number;
  dataHash: string;
  breeds: EnrichedBreed[];
}

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
  return res.json();
}

async function enrichBreed(breed: Breed): Promise<EnrichedBreed> {
  const imageUrl = breed.reference_image_id
    ? `https://cdn2.thedogapi.com/images/${breed.reference_image_id}.jpg`
    : "/placeholder.svg";

  return {
    ...breed,
    image_url: imageUrl,
  };
}

async function main() {
  console.log("🔄 Fetching breed data...");

  const breeds = await fetchAllBreeds();
  const enriched = await Promise.all(breeds.map(enrichBreed));
  const filtered = enriched.filter((b) => b.name && b.image_url);

  const cacheData: CacheData = {
    timestamp: Date.now(),
    dataHash: generateDataHash(breeds),
    breeds: filtered,
  };

  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2));

  console.log(`✅ Cache saved to ${CACHE_FILE}`);
}

main().catch((err) => {
  console.error("❌ Failed to generate cache:", err);
  process.exit(1);
});

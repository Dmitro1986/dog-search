/** @format */

import { Dispatch, SetStateAction } from "react";

import { searchBreedCache } from "@/services/client-cache-service";

interface BreedInfo {
  name: string;
  origin: string;
  temperament?: string;
  lifeSpan?: string;
  description: string;
  imageUrl: string | null;
  wikiUrl?: string | null;
  rawContent?: string;
  markdownContent?: string;
  isMarkdown?: boolean;
}

export async function fetchBreedInfo(
  breed: string,
  source: "default" | "wikipedia" | "chatgpt" | "cache" = "default",
  setInfoContent: Dispatch<SetStateAction<string>>,
  setBreedInfo: Dispatch<SetStateAction<BreedInfo | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setActiveSource: Dispatch<
    SetStateAction<"none" | "wikipedia" | "chatgpt" | "dogapi" | "cache">
  >,
  lang: string = "en"
) {
  setIsLoading(true);
  
  try {
    // Добавляем проверку кеша первым шагом
    const cachedData = await searchBreedCache(breed);
    if (cachedData && source === 'default') {
      setBreedInfo({
        name: breed,
        origin: "Кеш",
        description: cachedData.text,
        imageUrl: cachedData.image,
        wikiUrl: cachedData.url,
        isMarkdown: false,
      });
      setActiveSource('cache');
      return;
    }

    if (source === "chatgpt") {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breed }),
      });
      const data = await response.json();

      const imageMatch = data.markdown?.match(/!\[.*?\]\((.*?)\)/);
      const imageUrl = imageMatch?.[1] || data.imageUrl || null;

      setInfoContent(data.result);
      setBreedInfo({
        name: breed,
        origin: "ChatGPT",
        description: data.result,
        imageUrl,
        markdownContent: data.markdown,
        isMarkdown: true,
      });
      return;
    }

    if (source === "wikipedia") {
      const res = await fetch("/api/wikipedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breed, lang }),
      });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error);

      setInfoContent(data.result.text);
      setBreedInfo({
        name: data.result.title,
        origin: "Wikipedia",
        temperament: "",
        lifeSpan: "",
        description: data.result.text,
        imageUrl: data.result.image || null,
        wikiUrl: data.result.url || null,
        isMarkdown: false,
      });
      return;
    }

    // default: try Dog API, fallback Wikipedia
    const res = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: breed }),
    });
    const data = await res.json();

    if (!res.ok || data.error) throw new Error(data.error);

    setInfoContent(data.result.text);
    setBreedInfo({
      name: data.result.title,
      origin: data.source,
      temperament: data.result.temperament || "",
      lifeSpan: data.result.lifeSpan || "",
      description: data.result.text,
      imageUrl: data.result.image || null,
      wikiUrl: data.result.url || null,
      isMarkdown: false,
    });
    setActiveSource(data.source);
  } catch (err) {
    console.error("🐞 fetchBreedInfo error:", err);
    setInfoContent("Ошибка: " + (err as Error).message);
  } finally {
    setIsLoading(false);
  }
}

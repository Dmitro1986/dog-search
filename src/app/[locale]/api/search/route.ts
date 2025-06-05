/** @format */

import { isValidDogExtract } from "@/components/dog-utils";
// Импортируем серверный сервис кеширования
import { searchBreedCache } from "../../../../services/server-cache-service";






export async function POST(req: Request) {
  const { query } = await req.json();
  const name = query.trim();

  const isLatin = /^[a-z\s]+$/i.test(name);
  const isUkrainian = /[ґєії]/i.test(name);
  const isRussian = /[а-яё]/i.test(name);

  try {
    if (isLatin) {
      // Проверяем кеш (только для чтения)
      const cachedMatch = searchBreedCache(name);
      if (cachedMatch) {
        console.log("Возвращаем данные из кеша");
        return Response.json({
          source: "cache",
          result: cachedMatch,
        });
      }
      
      // Если нет в кеше, получаем из Wikipedia
      return await fetchFromWikipedia(name, "en");
    }

    if (isUkrainian) {
      return await fetchFromWikipedia(name, "uk");
    }

    if (isRussian) {
      const ruResult = await fetchFromWikipedia(name, "ru", false);
      if (ruResult) return ruResult;

      return await fetchFromWikipedia(name, "uk");
    }

    return await fetchFromWikipedia(name, "en");
  } catch (err) {
    console.error("Search API error:", err);
    return Response.json(
      { error: "Failed to fetch breed info" },
      { status: 500 }
    );
  }
}

// Поиск в Википедии с фильтром
async function fetchFromWikipedia(
  name: string,
  lang: string,
  throwOnFail = true,
  validateContent = true
) {
  const wikiQuery = encodeURIComponent(name.replace(/ /g, "_"));
  const wikiUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${wikiQuery}`;
  
  try {
    const wikiRes = await fetch(wikiUrl);

    if (!wikiRes.ok) {
      // Вместо выброса ошибки, возвращаем запасной вариант
      if (throwOnFail) {
        console.log(`Wikipedia page not found for "${name}" in ${lang} language`);
        return Response.json({
          source: "fallback",
          result: {
            title: name,
            text: `Информация о породе "${name}" не найдена в Википедии. Пожалуйста, проверьте правильность написания или попробуйте другой язык.`,
            temperament: "",
            lifeSpan: "",
            image: null,
            url: null,
          },
        });
      }
      return null;
    }

    const wiki = await wikiRes.json();

    if (validateContent && !isValidDogExtract(name, wiki.extract)) {
      return Response.json(
        {
          error: "Похоже, вы ввели не название породы собаки.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      source: "wikipedia",
      result: {
        title: wiki.title,
        text: wiki.extract,
        temperament: "",
        lifeSpan: "",
        image: wiki.thumbnail?.source || null,
        url: wiki.content_urls?.desktop?.page || null,
      },
    });
  } catch (error) {
    console.error(`Error fetching from Wikipedia: ${error}`);
    if (throwOnFail) {
      return Response.json({
        source: "error",
        result: {
          title: name,
          text: `Произошла ошибка при получении информации о породе "${name}". Пожалуйста, попробуйте позже.`,
          temperament: "",
          lifeSpan: "",
          image: null,
          url: null,
        },
      });
    }
    return null;
  }
}


/** @format */

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set" },
      { status: 500 }
    );
  }

  let body: { breed?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { breed } = body;
  if (typeof breed !== "string" || !breed.trim() || breed.length > 100) {
    return NextResponse.json({ error: "Invalid breed name" }, { status: 400 });
  }

  const prompt = `Ты — эксперт по собакам. Твоя задача — предоставить информацию о породе "${breed}" в формате Markdown.
Если информации о породе нет, верни строку: "Информация о данной породе отсутствует."

В ответ включи:
1. **Краткое описание** — 2–3 предложения.
2. **Характер** — выдели ключевые черты.
3. **Продолжительность жизни** — в годах.
4. **Markdown-изображение** — в формате ![название](url)
5. **Ссылки на статьи в Википедии** — Укажи настоящие, работающие ссылки для:
   - [Русская версия](https://ru.wikipedia.org/wiki/...)
   - [Украинская версия](https://uk.wikipedia.org/wiki/...)
   - [Английская версия](https://en.wikipedia.org/wiki/...)

Если нет статьи на одном из языков — просто не указывай её.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content:
              "Ты помощник, который точно предоставляет информацию о породах собак. Используй Markdown. Старайся искать локализованные названия для статей Википедии.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI API error:", res.status, errText);
      return NextResponse.json(
        { error: "OpenAI API error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Markdown image extraction
    const match = content.match(/!\[.*?\]\((.*?)\)/);
    const imageUrl = match?.[1] || null;

    // Проверка: если GPT вернул "Информация отсутствует"
    const isMissing = /информация о.*отсутствует/i.test(content);

    return NextResponse.json({
      result: isMissing
        ? "Информация о данной породе отсутствует."
        : content.trim(),
      markdown: content.trim(),
      imageUrl,
    });
  } catch (err: any) {
    clearTimeout(timeout);
    console.error("OpenAI fetch error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch from OpenAI" },
      { status: err.name === "AbortError" ? 504 : 500 }
    );
  }
}

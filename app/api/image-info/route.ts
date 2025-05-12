/** @format */

// app/api/image-info/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (!file) {
    console.warn("⚠️ Запрос без параметра 'file'");
    return new Response(JSON.stringify({ error: "Missing 'file' parameter" }), {
      status: 400,
    });
  }

  console.log("📥 Обработка изображения:", file);

  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
    file
  )}&prop=imageinfo&iiprop=url&format=json&origin=*`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      console.error(`❌ Wikipedia API error: ${res.status} ${res.statusText}`);
      throw new Error(`Wikipedia API error: ${res.statusText}`);
    }

    const data = await res.json();

    const pages = data?.query?.pages;
    const firstPageKey = Object.keys(pages || {})[0];
    const page = pages?.[firstPageKey];

    const imageUrl = page?.imageinfo?.[0]?.url;

    if (!imageUrl) {
      console.warn("🚫 Картинка не найдена в Wikipedia API:", file);
      return new Response(JSON.stringify({ error: "Image not found" }), {
        status: 404,
      });
    }

    console.log("✅ Картинка найдена:", imageUrl);
    return new Response(JSON.stringify({ imageUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Ошибка при получении изображения:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch image info" }),
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get("url");
  
  if (!imageUrl) {
    return NextResponse.json({ error: "URL не указан" }, { status: 400 });
  }
  
  try {
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error(`Ошибка при загрузке изображения: ${response.status} ${response.statusText}`);
      // Перенаправляем на запасное изображение
      return NextResponse.redirect(new URL("/images/dog-placeholder.jpg", req.url));
    }
    
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error: any) {
    console.error("Ошибка прокси изображения:", error);
    // Перенаправляем на запасное изображение
    return NextResponse.redirect(new URL("/images/dog-placeholder.jpg", req.url));
  }
}
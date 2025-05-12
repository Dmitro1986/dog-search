/** @format */
"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WikipediaModalProps {
  breedName: string;
  isOpen: boolean;
  onClose: () => void;
  defaultLang?: "ru" | "en" | "uk";
}

export function WikipediaModal({
  breedName,
  isOpen,
  onClose,
  defaultLang = "ru",
}: WikipediaModalProps) {
  const [htmlContent, setHtmlContent] = useState("");
  const [lang, setLang] = useState<"ru" | "en" | "uk">(defaultLang);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWikipediaHTML = async () => {
    setIsLoading(true);
    setError("");
    setHtmlContent("");

    const languageOrder = [lang, "uk", "en"];
    let success = false;

    for (const currentLang of languageOrder) {
      const apiUrl = `https://${currentLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        breedName
      )}`;

      console.log("📥 Wikipedia fetch:", apiUrl);

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) continue;

        const data = await res.json();
        if (!data.extract) continue;

        const html = `
          <h1 class="text-2xl font-bold mb-4">${data.title}</h1>
          <p>${data.extract}</p>
          ${
            data.thumbnail?.source
              ? `<img src="${data.thumbnail.source}" class="mt-4 rounded-md max-w-full h-auto border" />`
              : ""
          }
          <div class="mt-4">
            <a href="${
              data.content_urls.desktop.page
            }" target="_blank" class="text-blue-600 hover:underline">Читать на Википедии</a>
          </div>
        `;

        setHtmlContent(html);
        setLang(currentLang as any);
        success = true;
        break;
      } catch (err) {
        console.warn("Wikipedia fetch error:", err);
      }
    }

    if (!success) {
      setError("Информация о данной породе отсутствует в Википедии.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && breedName) {
      fetchWikipediaHTML();
    }
  }, [isOpen, breedName]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between w-full">
            <span>
              Википедия: {breedName}{" "}
              <span className="text-xs text-gray-500 ml-2">({lang})</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>

          <DialogDescription className="flex items-center justify-between">
            <span>Информация из Wikipedia API</span>
            <select
              className="ml-auto border px-2 py-1 text-sm rounded"
              value={lang}
              onChange={(e) => setLang(e.target.value as "ru" | "uk" | "en")}
            >
              <option value="ru">Русский</option>
              <option value="uk">Українська</option>
              <option value="en">English</option>
            </select>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Загрузка...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm py-4 text-center">{error}</p>
        ) : (
          <div
            className="wikipedia-content prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** @format */

"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WikipediaModal } from "./wikipedia-modal";
import { ImageModal } from "./image-modal";
import type { DogBreed } from "@/types/breed";

interface ExtendedDogBreed {
  name: string;
  origin: string;
  temperament: string;
  lifeSpan: string;
  description: string;
  imageUrl: string;
  isMarkdown?: boolean;
  markdownContent?: string;
  wikiUrl?: string;
}

interface DogBreedCardProps {
  breed: ExtendedDogBreed;
}

function extractFileNameFromContent(content: string): string | null {
  const fileTag = content.match(/File:([^\]\)\n\r]+)/)?.[1];
  if (fileTag) return fileTag.trim();

  const pathMatch = content.match(/\/([\w\-]+\.(jpg|jpeg|png))/i);
  if (pathMatch) return pathMatch[1];

  return null;
}

export function DogBreedCard({ breed }: DogBreedCardProps) {
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | null>(null);
  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // Добавляем состояние для языка, используя язык из breed если он есть, или ru по умолчанию
  const [currentLang, setCurrentLang] = useState<string>(breed.origin || "ru");
  // Функция локализации URL Википедии
  const getLocalizedWikiLink = (href: string): string => {
    if (href?.includes("wikipedia.org")) {
      // Заменяем любой языковой префикс на текущий язык
      return href.replace(/\/([a-z]{2})\.wikipedia\.org\//i, `/${currentLang}.wikipedia.org/`);
    }
    return href;
  };

  // Оставшийся код..

  const isMarkdown =
    breed.isMarkdown || breed.origin === "ChatGPT" || !!breed.markdownContent;

  const contentToRender = breed.markdownContent || breed.description || "";
  const extractedFileName = extractFileNameFromContent(contentToRender);
  const containsMarkdownImage = /!\[.*?\]\((.*?)\)/.test(contentToRender);

  useEffect(() => {
    let isMounted = true;

    if (containsMarkdownImage) return;

    async function resolveImage() {
      if (breed.imageUrl) {
        setResolvedImageUrl(breed.imageUrl);
        return;
      }

      if (extractedFileName) {
        try {
          const res = await fetch(
            `/api/image-info?file=${encodeURIComponent(extractedFileName)}`
          );
          const data = await res.json();
          if (data.imageUrl && isMounted) {
            setResolvedImageUrl(data.imageUrl);
          }
        } catch (err) {
          console.warn("Ошибка загрузки изображения:", err);
        }
      }
    }

    resolveImage();

    return () => {
      isMounted = false;
    };
  }, [breed.imageUrl, extractedFileName, containsMarkdownImage]);

  const imageUrlToDisplay = breed.imageUrl 
    ? `/api/proxy-image?url=${encodeURIComponent(breed.imageUrl)}` 
    : '/placeholder.jpg';

  return (
    <>
      <Card className="w-full bg-card text-card-foreground border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{breed.name}</CardTitle>
          {breed.origin && (
            <p className="text-xs text-muted-foreground">
              Источник: {breed.origin}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {!containsMarkdownImage && resolvedImageUrl && (
            <div className="w-full flex justify-center items-center bg-muted rounded-md overflow-hidden min-h-[220px] md:min-h-[320px] lg:min-h-[400px]">
              <img
                src={imageUrlToDisplay}
                alt={breed.name}
                className="w-full max-w-3xl h-auto aspect-video object-contain md:object-cover rounded-lg transition-all duration-300 cursor-pointer hover:opacity-90"
                style={{ maxHeight: '400px' }}
                onClick={() => setIsImageModalOpen(true)}
              />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Описание</h3>
            {isMarkdown ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{

                  a: ({ href, children, ...props }) => {
                    const isWiki = href?.includes("wikipedia.org");
                    
                    const getLocalizedWikiLink = (href: string | undefined): string => {
                      if (!href) return '';
                      
                      console.log("Оригинальный URL:", href, "Текущий язык:", currentLang);
                      
                      // Более надёжная замена, которая работает для всех форматов URL Wikipedia
                      if (href.includes("wikipedia.org")) {
                        // Заменяем любой языковой домен на текущий язык
                        const localizedUrl = href.replace(/\/\/([a-z]{2})\.wikipedia\.org\//i, `//${currentLang}.wikipedia.org/`);
                        console.log("Локализованный URL:", localizedUrl);
                        return localizedUrl;
                      }
                      return href;
                    };


                    // Сначала объявляем функцию
                    // const getLocalizedWikiLink = (href: string | undefined): string => {
                    //   if (!href) return ''; // Если href undefined, возвращаем пустую строку
                      
                    //   if (href.includes("wikipedia.org")) {
                    //     return href.replace(/\/([a-z]{2})\.wikipedia\.org\//i, `/${currentLang}.wikipedia.org/`);
                    //   }
                    //   return href;
                    // };
                    
                    // Затем используем её
                    const localizedHref = getLocalizedWikiLink(href);
                    
                    return isWiki ? (
                      // ... остальной код без изменений
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsWikiOpen(true);
                        }}
                        className="text-primary underline hover:opacity-80"
                      >
                        {children}
                      </button>
                    ) : (
                      <a
                        {...props}
                        href={localizedHref} // Используем локализованную ссылку
                        className="text-primary underline hover:opacity-80"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    );
                  },

                
                  p: ({ node, ...props }) => (
                    <p className="text-sm" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-md max-w-full h-auto border border-border shadow-sm my-4 cursor-pointer hover:opacity-90"
                      alt={props.alt || ""}
                      onClick={() => setIsImageModalOpen(true)}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ),
                }}
              >
                {contentToRender}
              </ReactMarkdown>
            ) : (
              <p className="text-sm whitespace-pre-line">{contentToRender}</p>
            )}
          </div>

          {breed.temperament && (
            <div>
              <h3 className="font-medium">Характер</h3>
              <p className="text-sm">{breed.temperament}</p>
            </div>
          )}

          {breed.lifeSpan && (
            <div>
              <h3 className="font-medium">Продолжительность жизни</h3>
              <p className="text-sm">{breed.lifeSpan}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <WikipediaModal
        breedName={breed.name}
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
        //defaultLang="ru"
        defaultLang={currentLang as "ru" | "en" | "uk"} // Используем текущий язык
      />
      
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={imageUrlToDisplay}
        altText={breed.name}
      />
    </>
  );
}

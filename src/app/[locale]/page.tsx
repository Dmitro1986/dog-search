"use client";

import Header from '@/components/ui/header';
import { useState, useEffect } from "react";
import { Search, Info, BookOpen, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DogBreedCard } from "@/components/dog-breed-card";
import { getRandomBreed as getRandomDogBreed } from "@/lib/dog-api";
import { fetchBreedInfo } from "@/lib/fetch-breed-info";
import { BreedDirectory } from "@/components/BreedDirectory";
import ReactMarkdown from "react-markdown";
import { DogLoader } from "@/components/ui/DogLoader";

export default function DogBreedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedInfo, setBreedInfo] = useState<any>(null);
  const [infoContent, setInfoContent] = useState("");
  const [activeSource, setActiveSource] = useState<"none" | "wikipedia" | "chatgpt" | "dogapi" | "cache">("none");
  const [isLoading, setIsLoading] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [wikiLang, setWikiLang] = useState<"ru" | "uk" | "en">("en");

  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem("dogSearchState");
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.selectedBreed && parsedState.infoContent) {
          setBreedInfo(parsedState.breedInfo);
          setInfoContent(parsedState.infoContent);
          setActiveSource(parsedState.activeSource);
          setSelectedBreed(parsedState.selectedBreed);
          setSearchQuery(parsedState.selectedBreed);
          setHasSearched(parsedState.hasSearched);
        }
      }
    } catch (error) {
      console.error("Ошибка восстановления состояния:", error);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      breedInfo,
      infoContent,
      activeSource,
      selectedBreed,
      searchQuery,
      hasSearched,
    };
    sessionStorage.setItem("dogSearchState", JSON.stringify(stateToSave));
  }, [breedInfo, infoContent, activeSource, selectedBreed, searchQuery, hasSearched]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const cachedState = sessionStorage.getItem("dogSearchState");
      if (cachedState) {
        const parsed = JSON.parse(cachedState);
        if (
          parsed.selectedBreed === searchQuery &&
          parsed.infoContent &&
          parsed.activeSource === "default"
        ) {
          console.log("✅ Пропускаем повторный fetch — данные из sessionStorage");
          setBreedInfo(parsed.breedInfo);
          setInfoContent(parsed.infoContent);
          setActiveSource(parsed.activeSource);
          setHasSearched(true);
          return;
        }
      }

      setSelectedBreed(searchQuery);
      setInfoContent("");
      setActiveSource("none");

      try {
        await fetchBreedInfo(
          searchQuery,
          "default",
          setInfoContent,
          setBreedInfo,
          setIsLoading,
          setActiveSource
        );
        setHasSearched(true);
      } catch (err) {
        console.error("Ошибка поиска породы:", err);
      }
    }
  };

  const handleRandomBreed = async () => {
    setIsLoading(true);
    setInfoContent("");
    setActiveSource("none");

    try {
      const randomBreed = await getRandomDogBreed();
      setSearchQuery(randomBreed.name);
      setSelectedBreed(randomBreed.name);
      await fetchBreedInfo(
        randomBreed.name,
        "default",
        setInfoContent,
        setBreedInfo,
        setIsLoading,
        setActiveSource
      );
      setHasSearched(true);
    } catch (error) {
      console.error("Ошибка случайной породы:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      <Header />
      <main className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-card text-card-foreground border-r p-4 hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Спросить ChatGPT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!selectedBreed || (activeSource === "chatgpt" && isLoading)}
                onClick={() =>
                  fetchBreedInfo(
                    selectedBreed,
                    "chatgpt",
                    setInfoContent,
                    setBreedInfo,
                    setIsLoading,
                    setActiveSource
                  )
                }
              >
                {isLoading && activeSource === "chatgpt" ? "Загрузка..." : "Спросить ChatGPT"}
              </Button>
            </CardContent>
          </Card>
        </aside>

           {/* Центральная часть */}
           <div className="flex-1 flex flex-col">
          {/* Поисковая строка и кнопки */}
          <div className="p-6 bg-card text-card-foreground">
            <div className="max-w-xl mx-auto flex flex-col gap-3">
              <div className="relative w-full">
                <Input
                  placeholder="Введите породу собаки"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Очистить поле"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 justify-between">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Поиск
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRandomBreed}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Случайная порода
                </Button>
              </div>
            </div>
          </div>
        </div>  

      </main>

    </div>
  );
}

{/* остальной контент страницы */}

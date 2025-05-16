/** @format */
"use client";

import { useState } from "react";
import { Search, Info, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DogBreedCard } from "@/components/dog-breed-card";
import { getRandomBreed as getRandomDogBreed, searchBreed as searchDogBreed } from "@/lib/dog-api";
import { fetchBreedInfo } from "@/lib/fetch-breed-info";
import { BreedDirectory } from "@/components/BreedDirectory";
import { PawPrint } from "lucide-react";
import { X } from "lucide-react";

export default function DogBreedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [breedInfo, setBreedInfo] = useState<any>(null);
  const [infoContent, setInfoContent] = useState("");
  const [activeSource, setActiveSource] = useState<
    "none" | "wikipedia" | "chatgpt" | "dogapi"
  >("none");

  const [isLoading, setIsLoading] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [wikiLang, setWikiLang] = useState<"ru" | "uk" | "en">("en");

  const handleSearch = async () => {
    if (searchQuery.trim()) {
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
      } finally {
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
    } finally {
    }
  };

  // Добавляем эту функцию mcdown где-нибудь в вашем компоненте
  const renderWithLinks = (text: string) => {
    return text.split("\n").map((paragraph, i) => (
      <p key={i} className="mb-2">
        {paragraph.split(" ").map((word, j) => {
          // Ищем markdown-ссылки вида [текст](URL)
          const match = word.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a
                key={j}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {match[1]}{" "}
              </a>
            );
          }
          return <span key={j}>{word} </span>;
        })}
      </p>
    ));
  };

  return (
    // <div className="flex flex-col min-h-screen bg-gray-50">
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 overflow-hidden">
        {/* Левая панель (только на десктопе) */}
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
                disabled={
                  !selectedBreed || (activeSource === "chatgpt" && isLoading)
                }
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
                {isLoading && activeSource === "chatgpt"
                  ? "Загрузка..."
                  : "Спросить ChatGPT"}
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

          {/* Вкладки на мобилке */}
          <div className="md:hidden border-t border-b">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="search">Каталог</TabsTrigger>
                <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
                <TabsTrigger value="wikipedia">Википедия</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="p-4 space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowDirectory((prev) => !prev)}
                >
                  {showDirectory
                    ? "Скрыть каталог пород"
                    : "Показать каталог пород"}
                </Button>

                {showDirectory && (
                  <BreedDirectory
                    onSelect={(breedName) => {
                      setSearchQuery(breedName);
                      handleSearch();
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="chatgpt" className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={
                    !selectedBreed || (activeSource === "chatgpt" && isLoading)
                  }
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
                  {isLoading && activeSource === "chatgpt"
                    ? "Загрузка..."
                    : "Спросить ChatGPT"}
                </Button>
              </TabsContent>

              <TabsContent value="wikipedia" className="p-4 space-y-3">
                {/* 3.1 Селектор языка */}
                <div className="flex items-center gap-2">
                  <label htmlFor="wiki-lang-mobile" className="text-sm">
                    Язык:
                  </label>
                  <select
                    id="wiki-lang-mobile"
                    value={wikiLang}
                    onChange={(e) => setWikiLang(e.target.value as any)}
                    className="border rounded px-2 py-1 text-sm flex-1"
                  >
                    <option value="uk">Українська</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* 3.2 Кнопка */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={
                    !selectedBreed ||
                    (activeSource === "wikipedia" && isLoading)
                  }
                  onClick={() =>
                    fetchBreedInfo(
                      selectedBreed,
                      "wikipedia",
                      setInfoContent,
                      setBreedInfo,
                      setIsLoading,
                      setActiveSource,
                      wikiLang // ← прокидываем тот же язык
                    )
                  }
                >
                  {isLoading && activeSource === "wikipedia"
                    ? "Загрузка..."
                    : "Спросить Википедию"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Карточка результата */}
          <div className="flex-1 p-4 overflow-auto">
            {isLoading ? (
              <p className="text-center text-gray-500">Поиск породы...</p>
            ) : breedInfo ? (
              <DogBreedCard breed={breedInfo} />
            ) : hasSearched ? (
              <p className="text-center text-gray-500">Порода не найдена.</p>
            ) : (
              <p className="text-center text-gray-500 text-sm max-w-md mx-auto">
                🐶 Введите породу или выберите из <strong>каталога</strong> и
                нажмите <strong>Поиск</strong>.<br />
                📚 Для <strong>Википедии</strong> выберите язык в селекторе (🇬🇧
                English по умолчанию, <strong>Українська</strong>, 🇺🇦
                россійська)&nbsp;— язык запроса <strong>ДОЛЖЕН</strong> \
                соответствовать выбранной версии. Нажмите «Спросить Википедию».
                <br />
                🤖 Чтобы дополнительно узнать о породе, а также получить
                названия в украинской или русской Википедии, нажмите{" "}
                <strong>спросить ChatGPT</strong>.
              </p>
            )}
          </div>
        </div>

        {/* Правая панель (только на десктопе) */}
        <aside className="w-64 bg-card text-card-foreground border-l p-4 hidden md:flex flex-col gap-6">
          {/* Википедия */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Спросить Википедию
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Селектор языка */}
              <div className="flex items-center gap-2">
                <label htmlFor="wiki-lang" className="text-xs">
                  Язык:
                </label>
                <select
                  id="wiki-lang"
                  value={wikiLang}
                  onChange={(e) => setWikiLang(e.target.value as any)}
                  className="border rounded px-2 py-1 text-xs"
                >
                  <option value="uk">Українська</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Кнопка */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={
                  !selectedBreed || (activeSource === "wikipedia" && isLoading)
                }
                onClick={() =>
                  fetchBreedInfo(
                    selectedBreed,
                    "wikipedia",
                    setInfoContent,
                    setBreedInfo,
                    setIsLoading,
                    setActiveSource,
                    wikiLang
                  )
                }
              >
                {isLoading && activeSource === "wikipedia"
                  ? "Загрузка..."
                  : "Спросить Википедию"}
              </Button>
            </CardContent>
          </Card>

          {/* Каталог пород */}
          <BreedDirectory
            onSelect={(breedName, lang) => {
              setSearchQuery(breedName);
              fetchBreedInfo(
                breedName,
                "default",
                setInfoContent,
                setBreedInfo,
                setIsLoading,
                setActiveSource,
                lang
              );
            }}
          />
        </aside>
      </main>

      <footer className="bg-card text-card-foreground border-t p-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">Загрузка информации...</p>
          ) : infoContent ? (
            <div className="p-4 bg-muted text-muted-foreground rounded-lg border border-border">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Информация о породе {selectedBreed}
                <span className="ml-2 text-xs text-muted-foreground">
                  (Источник: {activeSource})
                </span>
              </h3>

              {activeSource === "chatgpt" ? (
                <div className="text-sm [&>p]:mb-2">
                  {infoContent.split("\n").map((paragraph, i) => {
                    const processedParagraph = paragraph.replace(
                      /\[(.*?)\]\((.*?)\)/g,
                      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
                    );
                    return (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: processedParagraph }}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-line">{infoContent}</p>
              )}
            </div>
          ) : breedInfo ? (
            <p className="text-center text-gray-500">
              Выберите источник информации
            </p>
          ) : (
            <p className="text-center text-gray-500">Найди своего любимца</p>
          )}
        </div>
      </footer>
    </div>
  );
}

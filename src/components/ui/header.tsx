"use client";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PawPrint, Coffee } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const translations = {
  ru: {
    title: "Каталог пород собак",
    subtitle: "Выберите себе друга",
    buyCoffee: "На кофе",
  },
  uk: {
    title: "Каталог порід собак",
    subtitle: "Обири собі друга",
    buyCoffee: "На каву",
  },
  en: {
    title: "Dog Breed Directory",
    subtitle: "Choose your perfect breed",
    buyCoffee: "For coffee",
  },
} as const;

export default function Header() {
  const pathname = usePathname();
  const pathLocale = pathname.split("/")[1] as keyof typeof translations;
  const locale = translations[pathLocale] ? pathLocale : "uk";
  
  const { title, subtitle, buyCoffee } = translations[locale];
  
  return (
    <header className="relative bg-background border-b border-border p-4">
      {/* Кнопка "Купить кофе" в левом верхнем углу */}
      <div className="absolute left-2 top-4">
        <a 
          href="#"
          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-foreground bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 rounded-md transition-colors"
          title={buyCoffee}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span className="sm:hidden text-xs">
            {buyCoffee}
          </span>
        </a>
      </div>
      
      {/* ThemeToggle остается в правом верхнем углу */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      {/* Основной контент центрируется */}
      <div className="flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto">
        {/* LanguageSwitcher центрируется на всех устройствах */}
        <div className="flex justify-center">
          <LanguageSwitcher />
        </div>
        
        {/* Заголовок центрируется */}
        <div className="text-center">
          <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-foreground">
            <PawPrint className="w-6 h-6 text-primary" />
            {title}
            {/* <PawPrint className="w-6 h-6 text-primary" /> */}
          </h1>
          <h3 className="text-xl font-bold text-muted-foreground mt-1">
            {subtitle} 🐾
          </h3>
        </div>
      </div>
    </header>
  );
}

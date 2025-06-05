"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PawPrint } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const translations = {
  ru: {
    title: "Каталог пород собак",
    subtitle: "Выберите свою идеальную породу",
  },
  uk: {
    title: "Каталог порід собак",
    subtitle: "Обирайте свою ідеальну породу",
  },
  en: {
    title: "Dog Breed Directory",
    subtitle: "Choose your perfect breed",
  },
} as const;

export default function Header() {
  const pathname = usePathname();
  const pathLocale = pathname.split("/")[1] as keyof typeof translations;
  const locale = translations[pathLocale] ? pathLocale : "ru";

  const { title, subtitle } = translations[locale];

  return (
    <header className="relative bg-background border-b border-border p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="w-full md:w-auto md:mr-4 flex justify-center md:justify-start">
          <LanguageSwitcher />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-foreground">
            <PawPrint className="w-6 h-6 text-primary" />
            {title}
          </h1>
          <h3 className="text-xl font-bold text-muted-foreground mt-1">
            {subtitle}
          </h3>
        </div>
      </div>
    </header>
  );
}

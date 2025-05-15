/** @format */

"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PawPrint } from "lucide-react";

export default function Header() {
  return (
    <header className="relative bg-background border-b border-border p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-foreground">
            <PawPrint className="w-6 h-6 text-primary" />
            {/* <PawPrint className="w-6 h-6 text-foreground" strokeWidth={2} /> */}
            Породы собак
          </h1>
          <h3 className="text-xl font-bold text-muted-foreground mt-1">
            Узнай всё о своём любимце 🐾
          </h3>
        </div>
      </div>
    </header>
  );
}

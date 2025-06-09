// src/app/layout.tsx - корневой layout с HTML тегами



import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../../styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/ui/header";
import CacheInitializer from './components/CacheInitializer';

const inter = Inter({ subsets: ["latin", "cyrillic"] })
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Dog Breeds Search</title>
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}

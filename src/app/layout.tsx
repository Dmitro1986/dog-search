import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/ui/header";
import CacheInitializer from './components/CacheInitializer';
// import LanguageSwitcher from '@/components/LanguageSwitcher';

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Поиск пород собак",
  description: "Поиск информации о породах собак с использованием ChatGPT и Википедии",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <CacheInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}



// src/app/page.tsx - серверный redirect
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  // Получаем заголовки запроса
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Определяем предпочитаемый язык из заголовков браузера
  let targetLocale = 'uk'; // По умолчанию
  
  if (acceptLanguage.includes('ru')) {
    targetLocale = 'ru';
  } else if (acceptLanguage.includes('en')) {
    targetLocale = 'en';
  } else if (acceptLanguage.includes('uk')) {
    targetLocale = 'uk';
  }
  
  // Серверный redirect (лучше чем клиентский)
  redirect(`/${targetLocale}`);
}

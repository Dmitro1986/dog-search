import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['uk', 'ru', 'en'],

  // Used when no locale matches
  defaultLocale: 'uk',

  // Always use locale prefix
  localePrefix: 'always',
  
  // Автоматическое определение языка браузера
  localeDetection: true
});

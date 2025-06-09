// middleware.tsx
import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Корневой путь для редиректа
    '/',
    // Пути с локалями  
    '/(uk|ru|en)/:path*',
    // Исключаем системные пути
    '/((?!api|_next|favicon.ico|\\.well-known).*)'
  ]
};

// import createMiddleware from 'next-intl/middleware';
// import {routing} from './src/i18n/routing';

// export default createMiddleware(routing);

// export const config = {
//   // Включаем все пути включая корневой для редиректа
//   matcher: [
//     // Корневой путь для редиректа
//     '/',
//     // Пути с локалями  
//     '/(uk|ru|en)/:path*',
//     // Исключаем API, статику и файлы
//     '/((?!api|_next/static|_next/image|favicon.ico).*)'
//   ]
// };


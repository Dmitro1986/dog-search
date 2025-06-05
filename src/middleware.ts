import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ru', 'uk'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};

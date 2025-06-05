export default async function getRequestConfig({ locale }: { locale?: string }) {
  const fallback = 'en';
  const selectedLocale = locale ?? fallback;

  try {
    const messages = await import(`../messages/${selectedLocale}.json`).then((mod) => mod.default);
    return {
      locale: selectedLocale,
      messages,
    };
  } catch (error) {
    console.error(`[next-intl] Ошибка загрузки словаря для ${selectedLocale}`, error);
    return {
      locale: fallback,
      messages: await import(`../messages/${fallback}.json`).then((mod) => mod.default),
    };
  }
}

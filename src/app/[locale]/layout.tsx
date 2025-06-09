import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '../../i18n/routing';


export default async function LocaleLayout({ children, params }) {
    const { locale } = await params;
    // Ensure that the incoming `locale` is valid
    if (!hasLocale(routing.locales, locale)) {
        // Handle invalid locale
    }
    return (
        <>{children}</>
    );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

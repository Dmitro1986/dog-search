'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <div className="flex gap-2 items-center text-sm">
      <button
        onClick={() => changeLocale('ru')}
        className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
        disabled={pathname.startsWith('/ru') || isPending}
      >
        🇺🇦 рус
      </button>
      <button
        onClick={() => changeLocale('uk')}
        className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
        disabled={pathname.startsWith('/uk') || isPending}
      >
        🇺🇦 Укр
      </button>
      <button
        onClick={() => changeLocale('en')}
        className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50"
        disabled={pathname.startsWith('/en') || isPending}
      >
        🇬🇧 En
      </button>
    </div>
  );
}

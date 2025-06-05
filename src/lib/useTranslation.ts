"use client";

import { useEffect, useState } from "react";

type Locale = "ru" | "uk";
type Translations = { [key: string]: string };

export default function useTranslation() {
  const [t, setT] = useState<Translations>({ title: "", subtitle: "" });

  useEffect(() => {
    const locale = typeof window !== "undefined"
      ? sessionStorage.getItem("lang") || "ru"
      : "ru";

    import(`@/i18n/${locale}.json`)
      .then((mod) => setT(mod))
      .catch(() => setT({ title: "", subtitle: "" }));
  }, []);

  return t;
}

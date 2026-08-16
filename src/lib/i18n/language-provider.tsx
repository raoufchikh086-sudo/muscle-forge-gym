import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dictionaries,
  en,
  languages,
  type LanguageCode,
  type TranslationKey,
} from "./dictionaries";

const STORAGE_KEY = "ironcode.language";

type LanguageContextValue = {
  language: LanguageCode;
  dir: "ltr" | "rtl";
  setLanguage: (code: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is LanguageCode {
  return !!value && languages.some((l) => l.code === value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) setLanguageState(stored);
  }, []);

  const dir = useMemo<"ltr" | "rtl">(
    () => (languages.find((l) => l.code === language)?.dir === "rtl" ? "rtl" : "ltr"),
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = useCallback((code: LanguageCode) => {
    setLanguageState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[language]?.[key] ?? en[key] ?? key,
    [language],
  );

  const value = useMemo(
    () => ({ language, dir, setLanguage, t }),
    [language, dir, setLanguage, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: "en",
      dir: "ltr",
      setLanguage: () => {},
      t: (key) => en[key] ?? key,
    };
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}

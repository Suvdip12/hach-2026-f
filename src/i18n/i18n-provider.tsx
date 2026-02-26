"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  Locale,
  defaultLocale,
  getDictionary,
  isValidLocale,
  Dictionary,
} from "./dictionaries";

const LANGUAGE_STORAGE_KEY = "curiotech-language";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
  t: (key: string, variables?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

// Helper to safely get locale from localStorage
const getStoredLocale = (): Locale => {
  if (typeof window === "undefined") return defaultLocale;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && isValidLocale(stored) ? stored : defaultLocale;
};

// Subscribe to storage changes
const subscribeToStorage = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export function I18nProvider({ children }: I18nProviderProps) {
  // Use useSyncExternalStore for proper hydration handling
  const storedLocale = useSyncExternalStore(
    subscribeToStorage,
    getStoredLocale,
    () => defaultLocale, // Server snapshot
  );

  const [locale, setLocaleState] = useState<Locale>(storedLocale);

  // Sync with localStorage changes
  useEffect(() => {
    setLocaleState(storedLocale);
  }, [storedLocale]);

  // Update localStorage when locale changes
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    // Update the html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const dictionary = useMemo(() => getDictionary(locale), [locale]);

  // Translation function that supports nested keys like "hero.title" and template variables
  const t = useCallback(
    (key: string, variables?: Record<string, string>): string => {
      const keys = key.split(".");
      let value: unknown = dictionary;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          // Return the key if translation not found
          console.warn(`Translation not found for key: ${key}`);
          return key;
        }
      }

      if (typeof value === "string") {
        // Replace template variables like {name} with actual values
        if (variables) {
          return value.replace(/\{(\w+)\}/g, (match, varName) => {
            return variables[varName] !== undefined
              ? variables[varName]
              : match;
          });
        }
        return value;
      }

      console.warn(`Translation value for key "${key}" is not a string`);
      return key;
    },
    [dictionary],
  );

  // Prevent hydration mismatch by not rendering until mounted
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dictionary,
      t,
    }),
    [locale, setLocale, dictionary, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Convenience hook for just getting the translation function
export function useTranslation() {
  const { t, locale, dictionary } = useI18n();
  return { t, locale, dictionary };
}

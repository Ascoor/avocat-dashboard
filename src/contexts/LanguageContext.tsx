import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

type TranslateFn = <T = string>(key: string, options?: TOptions | Record<string, unknown>) => T;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslateFn;
  isRTL: boolean;
  direction: Direction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t: i18nextT } = useTranslation('common');

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('avocat_language');
      if (stored === 'ar' || stored === 'en') {
        return stored;
      }

      const browserLanguage =
        window.navigator.language || window.navigator.languages?.[0] || '';
      if (browserLanguage) {
        return browserLanguage.toLowerCase().startsWith('ar') ? 'ar' : 'en';
      }
    }

    if (i18n.language) {
      return i18n.language.startsWith('ar') ? 'ar' : 'en';
    }

    return 'en';
  });

  useEffect(() => {
    const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('avocat_language', language);
    }
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const normalized: Language = lng.startsWith('ar') ? 'ar' : 'en';
      setLanguageState((prev) => (prev === normalized ? prev : normalized));
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const t = useCallback(
    <T = string>(key: string, options?: TOptions | Record<string, unknown>) =>
      i18nextT(key, { defaultValue: key, ...(options ?? {}) }) as T,
    [i18nextT],
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr';

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isRTL: language === 'ar',
    direction,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

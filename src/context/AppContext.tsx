import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { VerifyState, Lang, Theme } from '../types';
import { en, type TranslationKey } from '../i18n/en';
import { zh } from '../i18n/zh';
import { zhHant } from '../i18n/zh-hant';
import { ja } from '../i18n/ja';
import { ru } from '../i18n/ru';
import { ko } from '../i18n/ko';
import { es } from '../i18n/es';
import { fr } from '../i18n/fr';
import { pt } from '../i18n/pt';
import { th } from '../i18n/th';
import { vi } from '../i18n/vi';
import { ar } from '../i18n/ar';

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en, zh, 'zh-hant': zhHant, ko, ja, ru, es, fr, pt, th, vi, ar,
};

interface AppCtx {
  state: VerifyState;
  setState: (s: VerifyState) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
  startLoading: () => void;
  t: Record<TranslationKey, string>;
}

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerifyState>('verified');
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const langMap: Record<string, string> = {
      en: 'en', zh: 'zh-CN', 'zh-hant': 'zh-TW',
      ko: 'ko', ja: 'ja', ru: 'ru', es: 'es', fr: 'fr', pt: 'pt', th: 'th', vi: 'vi',
    };
    document.documentElement.lang = langMap[lang] ?? lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const startLoading = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setState('verified');
    }, 2500);
  };

  return (
    <AppContext.Provider
      value={{
        state, setState,
        lang, setLang,
        theme, toggleTheme,
        isLoading, startLoading,
        t: translations[lang],
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}

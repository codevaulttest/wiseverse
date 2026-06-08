import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { en, type TranslationKey } from '../i18n/en'
import { zh } from '../i18n/zh'
import { zhHant } from '../i18n/zh-hant'
import { ja } from '../i18n/ja'
import { ru } from '../i18n/ru'
import { ar } from '../i18n/ar'
import { es } from '../i18n/es'
import { fr } from '../i18n/fr'
import { pt } from '../i18n/pt'
import { th } from '../i18n/th'
import { vi } from '../i18n/vi'

export type Lang = 'en' | 'zh' | 'zh-hant' | 'ja' | 'ru' | 'ar' | 'es' | 'fr' | 'pt' | 'th' | 'vi'

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en, zh, 'zh-hant': zhHant, ja, ru, ar, es, fr, pt, th, vi,
}

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: Record<TranslationKey, string>
}

const LangContext = createContext<LangCtx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = (l: Lang) => {
    setLangState(l)
    const langMap: Record<Lang, string> = {
      en: 'en', zh: 'zh-CN', 'zh-hant': 'zh-TW',
      ja: 'ja', ru: 'ru', ar: 'ar', es: 'es', fr: 'fr', pt: 'pt', th: 'th', vi: 'vi',
    }
    document.documentElement.lang = langMap[l]
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang outside LangProvider')
  return ctx
}

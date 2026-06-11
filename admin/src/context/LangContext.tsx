import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n'
import type { Lang, TransKey } from '../i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TransKey, vars?: Record<string, string | number>) => string
}

const LangContext = createContext<LangCtx>({
  lang: 'en',
  setLang: () => {},
  t: key => key,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    (localStorage.getItem('admin-lang') as Lang) || 'zh'
  )

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('admin-lang', l)
  }

  function t(key: TransKey, vars?: Record<string, string | number>): string {
    let str: string = translations[lang][key] ?? translations.en[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v))
      }
    }
    return str
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import type { Lang } from '../types'

const LANGS: { code: string; label: string }[] = [
  { code: 'en',      label: 'English' },
  { code: 'zh',      label: '简体中文' },
  { code: 'zh-hant', label: '繁體中文' },
  { code: 'ja',      label: '日本語' },
  { code: 'ru',      label: 'Русский' },
  { code: 'ar',      label: 'العربية' },
  { code: 'es',      label: 'Español' },
  { code: 'fr',      label: 'Français' },
  { code: 'pt',      label: 'Português' },
  { code: 'th',      label: 'ไทย' },
  { code: 'vi',      label: 'Tiếng Việt' },
]

const LANG_SHORT: Record<string, string> = {
  en: 'EN', zh: 'ZH', 'zh-hant': 'ZH', ja: 'JA', ru: 'RU',
  ar: 'AR', es: 'ES', fr: 'FR', pt: 'PT', th: 'TH', vi: 'VI',
}

export default function LangSwitcher() {
  const { lang, setLang } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const displayLabel = LANG_SHORT[lang] ?? 'EN'

  return (
    <div className={`lang-switcher${open ? ' open' : ''}`} ref={ref}>
      <button
        className="lang-trigger"
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Change language"
      >
        <svg className="lang-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20" />
          <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
        <span>{displayLabel}</span>
        <svg className="lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div className="lang-menu">
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            className={`lang-option${lang === code ? ' active' : ''}`}
            type="button"
            onClick={() => {
              setLang(code as Lang)
              setOpen(false)
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useLang, type Lang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'
import LangSwitcher from '../components/LangSwitcher'

const LANGS: { code: Lang; label: string }[] = [
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

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLang()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <a className="header-logo" href="/">
          <img src="/wiseverse-logo.svg" alt="" className="header-logo-img" />
          <span className="header-logo-name">Wiseverse</span>
        </a>

        <nav className="header-nav" aria-label="Main navigation">
          <a href="#how-it-works" onClick={e => { e.preventDefault(); scrollTo('how-it-works') }}>{t.nav_how}</a>
          <a href="#pricing" onClick={e => { e.preventDefault(); scrollTo('pricing') }}>{t.nav_pricing}</a>
          <a href="#faq" onClick={e => { e.preventDefault(); scrollTo('faq') }}>{t.nav_faq}</a>
        </nav>

        <div className="header-actions">
          <LangSwitcher />
          <button
            className="theme-toggle"
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <button
            className="header-cta"
            onClick={() => scrollTo('pricing')}
          >
            {t.nav_cta}
          </button>
        </div>

        <button
          className={`header-menu-btn${menuOpen ? ' open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay${menuOpen ? ' visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sidebar drawer */}
      <aside className={`sidebar${menuOpen ? ' open' : ''}`} aria-label="Mobile menu">
        <nav className="sidebar-nav">
          <a href="#how-it-works" onClick={e => { e.preventDefault(); scrollTo('how-it-works') }}>{t.nav_how}</a>
          <a href="#pricing" onClick={e => { e.preventDefault(); scrollTo('pricing') }}>{t.nav_pricing}</a>
          <a href="#faq" onClick={e => { e.preventDefault(); scrollTo('faq') }}>{t.nav_faq}</a>
        </nav>

        <div className="sidebar-divider" />

        {/* Theme toggle row */}
        <div className="sidebar-row">
          <span className="sidebar-row-label">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
          <button
            className="sidebar-theme-btn"
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Language list */}
        <div className="sidebar-divider" />
        <p className="sidebar-section-label">Language</p>
        <div className="sidebar-lang-list">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              className={`sidebar-lang-option${lang === code ? ' active' : ''}`}
              type="button"
              onClick={() => { setLang(code); setMenuOpen(false) }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sidebar-divider" />
        <button
          className="sidebar-cta"
          onClick={() => scrollTo('pricing')}
        >
          {t.nav_cta}
        </button>
      </aside>
    </>
  )
}

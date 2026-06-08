import { useLang } from '../context/LangContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">
            <img src="/wiseverse-logo.svg" alt="Wiseverse" className="footer-logo-img" />
            <span className="footer-name">Wiseverse PTE. LTD.</span>
          </div>
          <p className="footer-copy">
            {t.foot_copy}<br />
            {t.foot_rights}
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer links">
          <a
            href="mailto:support@wiseverse.net"
            className="footer-link"
          >
            support@wiseverse.net
          </a>
        </nav>
      </div>
    </footer>
  )
}

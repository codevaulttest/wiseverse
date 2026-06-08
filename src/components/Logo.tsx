import LangSwitcher from './LangSwitcher'

export default function Logo() {
  return (
    <div className="logo-wrap">
      <div className="logo-left">
        <img className="logo-mark" src="/wiseverse-logo.svg" alt="Wiseverse" />
        <div className="logo-text-wrap">
          <div className="logo-name">Wiseverse</div>
        </div>
      </div>
      <LangSwitcher />
    </div>
  )
}

import { useInView } from '../hooks/useInView'
import { useLang } from '../context/LangContext'

const ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97Z" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>,
]

export default function Compliance() {
  const [ref, inView] = useInView()
  const { t } = useLang()

  const items = [
    { title: t.comp1_title, desc: t.comp1_desc },
    { title: t.comp2_title, desc: t.comp2_desc },
    { title: t.comp3_title, desc: t.comp3_desc },
    { title: t.comp4_title, desc: t.comp4_desc },
  ]

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section reveal${inView ? ' in-view' : ''}`}
      aria-labelledby="compliance-heading"
    >
      <div className="sec-eyebrow">{t.comp_eyebrow}</div>
      <h2 className="sec-heading" id="compliance-heading">{t.comp_heading}</h2>
      <p className="sec-sub">{t.comp_sub}</p>

      <div className="compliance-grid">
        {items.map((item, i) => (
          <div
            key={i}
            className={`comp-card reveal${inView ? ' in-view' : ''} reveal-delay-${i + 1}`}
          >
            <div className="comp-icon" aria-hidden="true">{ICONS[i]}</div>
            <h3 className="comp-title">{item.title}</h3>
            <p className="comp-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
